import LineProvider from "next-auth/providers/line";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import { getData, postData } from "@/lib/fetchData";
import { JWT } from "next-auth/jwt";
import { httpClient } from "../../../../lib/fetchData";

async function refreshToken(token: JWT): Promise<JWT> {
  const res = await postData("auth/token/refresh", {
    refreshToken: token.refreshToken,
  });

  const user = await getData("users/me", res.data?.data?.accessToken);

  const data = {
    id: user?.data?.data?.id,
    user: user?.data?.data,
    accessToken: res.data?.data?.accessToken,
    refreshToken: res.data?.data?.refreshToken,
    expiresIn: res.data?.data?.expiresIn,
  };

  return data;
}

export const authOptions: AuthOptions = {
  // adapter: AuthRestAdapter(),
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID as string,
      clientSecret: process.env.LINE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await postData("auth/sign-in", {
          email: credentials?.email,
          password: credentials?.password,
          provider: "credentials",
        });

        if (res.data?.data.accessToken) {
          const user = await getData("users/me", res.data?.data?.accessToken);
          return {
            id: user?.data?.data?.id,
            user: user?.data?.data,
            accessToken: res.data?.data.accessToken,
            refreshToken: res.data?.data.refreshToken,
            expiresIn: res.data?.data.expiresIn,
          };
        } else {
          return null;
        }
      },
    }),
  ],

  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    signIn: async (user) => {
      return true;
    },
    jwt: async ({ token, user, account }) => {
      if (user && token && account) {
        if (account!.provider === "line") {
          const data = {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            account: account,
            user: user,
          };
          const signInResponse = await postData("auth/sign-in", data);

          const userData = await getData(
            "users/me",
            signInResponse.data?.data?.accessToken
          );
          token.user = userData.data.data;
          token.accessToken = signInResponse.data?.data?.accessToken;
          token.refreshToken = signInResponse.data?.data?.refreshToken;
          token.expiresIn = signInResponse.data?.data?.expiresIn;

          return token;
        } else if (account!.provider === "credentials") {
          token.user = user.user;
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
          token.expiresIn = user.expiresIn;
          return token;
        }
      }

      if (new Date().getTime() < token.expiresIn) {
        return token;
      } else {
        return await refreshToken(token);
      }
    },
    session: async ({ session, token }) => {
      httpClient.interceptors.request.use(
        async (config) => {
          // const { data: session, status } = useSession();
          if (token?.accessToken) {
            config.headers["Authorization"] = `Bearer ${token?.accessToken}`;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
      session.user = token?.user;
      session.accessToken = token?.accessToken;

      // session.refreshToken = token?.refreshToken;
      // session.expiresIn = token?.expiresIn;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
