import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

export const createTable = pgTableCreator((name) => `music_${name}`); // Custom prefix create table helper function

// Core tables
export const users = createTable(
  "user",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    bio: text("bio"),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: timestamp("email_verified", {
      mode: "date",
      withTimezone: true,
    }),
    image: text("image"),
    instagram: varchar("instagram", { length: 255 }),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    nameIdx: index("user_name_idx").on(table.name),
    idIdx: index("user_id_idx").on(table.id),
  })
);

export const categories = createTable("category", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const songs = createTable(
  "song",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    artistId: varchar("artist_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    fileUrl: text("file_url").notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    categoryId: varchar("category_id", { length: 255 }).references(
      () => categories.id,
      { onDelete: "restrict" }
    ),
    description: text("description"),
    image: text("image"),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    categoryIdx: index("song_category_idx").on(table.categoryId),
    artistIdx: index("song_artist_idx").on(table.artistId),
    createdAtIdx: index("song_created_at_idx").on(table.createdAt),
    titleIdx: index("song_title_idx").on(table.title),
  })
);

export const songListens = createTable(
  "song_listen",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    songId: varchar("song_id", { length: 255 })
      .notNull()
      .references(() => songs.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    timestamp: timestamp("timestamp", { mode: "date", withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    songIdx: index("song_listen_song_idx").on(table.songId),
    userIdx: index("song_listen_user_idx").on(table.userId),
    timestampIdx: index("song_listen_timestamp_idx").on(table.timestamp),
  })
);

export const likes = createTable(
  "like",
  {
    songId: varchar("song_id", { length: 255 })
      .notNull()
      .references(() => songs.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.songId, table.userId] }),
  })
);

export const tags = createTable("tag", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
});

export const songTags = createTable(
  "song_tag",
  {
    songId: varchar("song_id", { length: 255 })
      .notNull()
      .references(() => songs.id, { onDelete: "cascade" }),
    tagId: varchar("tag_id", { length: 255 })
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.songId, table.tagId] }),
  })
);

export const follows = createTable(
  "user_follow",
  {
    followerId: varchar("follower_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followingId: varchar("following_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.followerId, table.followingId] }),
  })
);

// NextAuth tables
export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  })
);

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  })
);

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  songs: many(songs),
  likes: many(likes),
  accounts: many(accounts),
  following: many(follows),
  followers: many(follows),
  songListens: many(songListens),
}));

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
  }),
  following: one(users, {
    fields: [follows.followingId],
    references: [users.id],
  }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  song: one(songs, { fields: [likes.songId], references: [songs.id] }),
  user: one(users, { fields: [likes.userId], references: [users.id] }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  songs: many(songs),
}));

export const songsRelations = relations(songs, ({ one, many }) => ({
  artist: one(users, { fields: [songs.artistId], references: [users.id] }),
  category: one(categories, {
    fields: [songs.categoryId],
    references: [categories.id],
  }),
  likes: many(likes),
  tags: many(songTags),
  songListens: many(songListens),
}));

export const songListensRelations = relations(songListens, ({ one }) => ({
  song: one(songs, { fields: [songListens.songId], references: [songs.id] }),
  user: one(users, { fields: [songListens.userId], references: [users.id] }),
}));

export const songTagsRelations = relations(songTags, ({ one }) => ({
  song: one(songs, { fields: [songTags.songId], references: [songs.id] }),
  tag: one(tags, { fields: [songTags.tagId], references: [tags.id] }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

import { InferSelectModel } from "drizzle-orm";

export type User = InferSelectModel<typeof users>;
export type Category = InferSelectModel<typeof categories>;
export type Song = InferSelectModel<typeof songs>;
export type SongListen = InferSelectModel<typeof songListens>;
export type Like = InferSelectModel<typeof likes>;
export type Tag = InferSelectModel<typeof tags>;
export type SongTag = InferSelectModel<typeof songTags>;
export type Follow = InferSelectModel<typeof follows>;
export type Account = InferSelectModel<typeof accounts>;
export type Session = InferSelectModel<typeof sessions>;
export type VerificationToken = InferSelectModel<typeof verificationTokens>;
export type SongWithArtistName = Song & { artistName: string };
