import { and, eq } from "drizzle-orm";
import { drizzle } from "@lib/orms/drizzle";
import { stores, storeUsers, users } from "@lib/orms/drizzle/schema";
import { SessionProps, StoreData } from "@types";

export async function setUser({ user }: SessionProps) {
  if (!user) return null;

  const { email, id, username } = user;
  const userData = { email, userId: id, username };

  await drizzle
    .insert(users)
    .values(userData)
    .onConflictDoUpdate({ target: users.userId, set: userData });
}

export async function setStore(session: SessionProps) {
  const { access_token: accessToken, context, scope } = session;
  // Only set on app install or update
  if (!accessToken || !scope) return null;

  const storeHash = context?.split("/")[1] || "";
  const storeData: Required<StoreData> = { accessToken, scope, storeHash };

  await drizzle
    .insert(stores)
    .values(storeData)
    .onConflictDoUpdate({ target: stores.storeHash, set: storeData });
}

export async function setStoreUser(session: SessionProps) {
  const {
    access_token: accessToken,
    context,
    owner,
    sub,
    user: { id: userId },
  } = session;
  if (!userId) return null;

  const contextString = context ?? sub;
  const storeHash = contextString?.split("/")[1] || "";

  const storeUser = await drizzle
    .select()
    .from(storeUsers)
    .where(
      and(eq(storeUsers.userId, userId), eq(storeUsers.storeHash, storeHash))
    );

  if (accessToken) {
    // Create a new admin user if none exists
    if (!storeUser.length) {
      await drizzle
        .insert(storeUsers)
        .values({ isAdmin: true, storeHash, userId });
    } else if (!storeUser[0]?.isAdmin) {
      await drizzle
        .update(storeUsers)
        .set({ isAdmin: true })
        .where(
          and(
            eq(storeUsers.userId, userId),
            eq(storeUsers.storeHash, storeHash)
          )
        );
    }
  } else {
    // Create a new user if it doesn't exist (non-store owners added here for multi-user apps)
    if (!storeUser.length) {
      await drizzle
        .insert(storeUsers)
        .values({ isAdmin: owner.id === userId, storeHash, userId });
    }
  }
}

export async function deleteUser({ context, user, sub }: SessionProps) {
  const contextString = context ?? sub;
  const storeHash = contextString?.split("/")[1] || "";

  await drizzle
    .delete(storeUsers)
    .where(
      and(eq(storeUsers.userId, user.id), eq(storeUsers.storeHash, storeHash))
    );
}

export async function hasStoreUser(storeHash: string, userId: string) {
  if (!storeHash || !userId) return false;

  const results = await drizzle
    .select()
    .from(storeUsers)
    .where(
      and(
        eq(storeUsers.userId, parseInt(userId)),
        eq(storeUsers.storeHash, storeHash)
      )
    );

  return results.length > 0;
}

export async function getStoreToken(storeHash: string) {
  if (!storeHash) return null;

  const results = await drizzle
    .select({ accessToken: stores.accessToken })
    .from(stores)
    .where(eq(stores.storeHash, storeHash));

  return results.length ? results[0].accessToken : null;
}

export async function deleteStore({ store_hash: storeHash }: SessionProps) {
  await drizzle.delete(stores).where(eq(stores.storeHash, storeHash));
}
