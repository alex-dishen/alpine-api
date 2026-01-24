// Auto-generated CRUD types for Kysely
// Generated at 2025-09-13T05:59:31.541Z

import type { ColumnType, Generated, Selectable, Insertable, Updateable } from 'kysely';

export enum MessageSenderRole {
  MODEL = 'model',
  USER = 'user',
}

export enum ConnectionType {
  ATTACHED = 'attached',
  DETACHED = 'detached',
  TEMPORARY = 'temporary',
}

export enum ContextType {
  FULL_MESSAGE = 'full_message',
  TEXT_SELECTION = 'text_selection',
}

export enum FileStatus {
  PENDING_UPLOAD = 'pending_upload',
  UPLOADED = 'uploaded',
}

export enum FileCategory {
  IMAGE = 'image',
  DOCUMENT = 'document',
}

export enum FileBindingType {
  MESSAGE = 'message',
}

export enum UserProvider {
  GOOGLE = 'google',
  LINKEDIN = 'linkedin',
  APPLE = 'apple',
}

type ChatTable = {
  id: Generated<string>;
  parent_chat_id: string | null;
  user_id: string;
  root_chat_id: string | null;
  folder_id: string | null;
  name: string;
  depth: Generated<number>;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
  is_deleted: Generated<boolean>;
  deleted_at: ColumnType<Date, Date | string | undefined, Date | string>;
  position_y: Generated<number>;
  position_x: Generated<number>;
  path: string[];
};
export type ChatGetOutput = Selectable<ChatTable>;
export type ChatCreateInput = Insertable<ChatTable>;
export type ChatUpdateInput = Updateable<ChatTable>;

type MessageTable = {
  id: Generated<string>;
  parent_message_id: string | null;
  chat_id: string;
  user_id: string | null;
  content: string;
  llm_model: string | null;
  role: MessageSenderRole;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
};
export type MessageGetOutput = Selectable<MessageTable>;
export type MessageCreateInput = Insertable<MessageTable>;
export type MessageUpdateInput = Updateable<MessageTable>;

type MessageReplyTable = {
  id: Generated<string>;
  message_id: string;
  message_id_replied_to: string;
  reply_content: string;
};
export type MessageReplyGetOutput = Selectable<MessageReplyTable>;
export type MessageReplyCreateInput = Insertable<MessageReplyTable>;
export type MessageReplyUpdateInput = Updateable<MessageReplyTable>;

type ChatMetadataTable = {
  id: Generated<string>;
  child_chat_id: string;
  parent_chat_id: string;
  parent_message_id: string;
  child_message_id: string | null;
  selected_text: string | null;
  start_position: number | null;
  end_position: number | null;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
  context_type: ContextType;
  connection_type: ConnectionType;
  connection_color: string;
};
export type ChatMetadataGetOutput = Selectable<ChatMetadataTable>;
export type ChatMetadataCreateInput = Insertable<ChatMetadataTable>;
export type ChatMetadataUpdateInput = Updateable<ChatMetadataTable>;

type FileTable = {
  id: Generated<string>;
  bucket: string;
  object_key: string;
  original_filename: string;
  extension: string;
  mime_type: string;
  category: FileCategory;
  size_bytes: bigint;
  status: Generated<FileStatus>;
  uploader_id: string;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
};
export type FileGetOutput = Selectable<FileTable>;
export type FileCreateInput = Insertable<FileTable>;
export type FileUpdateInput = Updateable<FileTable>;

type FileBindingTable = {
  id: Generated<string>;
  file_id: string;
  target_type: FileBindingType;
  target_id: string;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
};
export type FileBindingGetOutput = Selectable<FileBindingTable>;
export type FileBindingCreateInput = Insertable<FileBindingTable>;
export type FileBindingUpdateInput = Updateable<FileBindingTable>;

type FolderTable = {
  id: Generated<string>;
  root_folder_id: string | null;
  parent_folder_id: string | null;
  user_id: string;
  name: string;
  depth: Generated<number>;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
  is_deleted: Generated<boolean>;
  deleted_at: ColumnType<Date, Date | string | undefined, Date | string>;
  path: string[];
};
export type FolderGetOutput = Selectable<FolderTable>;
export type FolderCreateInput = Insertable<FolderTable>;
export type FolderUpdateInput = Updateable<FolderTable>;

type UserTable = {
  id: Generated<string>;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
  password: string | null;
  provider: UserProvider | null;
  provider_id: string | null;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
};
export type UserGetOutput = Selectable<UserTable>;
export type UserCreateInput = Insertable<UserTable>;
export type UserUpdateInput = Updateable<UserTable>;

export type DB = {
  chats: ChatTable;
  messages: MessageTable;
  message_replies: MessageReplyTable;
  chat_metadata: ChatMetadataTable;
  files: FileTable;
  file_bindings: FileBindingTable;
  folders: FolderTable;
  users: UserTable;
};
