# Naming Conventions for Folders and Files

This document defines the naming conventions for all folders and files in this project. **Consistent naming** ensures clarity, easier onboarding, and scalability for all team members.

## 📑 Table of Contents

- [Folder Naming](#️-folder-naming)
- [File Naming](#-file-naming)
- [Class Naming](#-class-naming)
- [Examples With Levels](#-examples-with-levels)
- [Quick Reference Table](#-quick-reference-table)
- [What to Avoid](#-what-to-avoid)
- [Summary](#-summary)

---

## 🗂️ **Folder Naming**

- **Domain/Feature folders:** Use **singular**.
  - Represents a broad feature or bounded context.
  - Example: `chat/`, `user/`, `order/`
- **Resource subfolders:** Use **plural**.
  - Represents collections of entities/resources.
  - Example: `messages/`, `attachments/`, `participants/`, `posts/`

---

## 📄 **File Naming**

- **Class files:** Use **singular** and `kebab-case` for filenames.
  - Example: `message.service.ts`, `chat.controller.ts`
- **Data Transfer Objects (DTOs):** Use **kebab-case** and indicate their purpose.
  - Example: `create-message.dto.ts`, `update-chat.dto.ts`
- **Entities/Models:** Use **singular** for class name, `kebab-case` for filename.
  - Example: `message.entity.ts`, `chat.entity.ts`
- **Module files:** Use the folder/feature name.
  - Example: `chat.module.ts`, `messages.module.ts`

---

## 🏷️ **Class Naming**

- Always use **Singular** and **PascalCase**.
  - Example: `MessageService`, `ChatController`, `AttachmentEntity`, `CreateMessageDto`

---

## 📚 **Examples With Levels**

```
src/
│
├── chat/                  # Domain/feature (singular)
│   │
│   ├── chat.module.ts
│   │
│   ├── chats/             # Resource (plural)
│   │   ├── chats.controller.ts     # class ChatsController
│   │   ├── chats.service.ts        # class ChatsService
│   │   ├── chats.repository.ts     # class ChatsRepository
│   │   ├── dto/
│   │   │   ├── create-chat.dto.ts  # class CreateChatDto
│   │   │   └── update-chat.dto.ts  # class UpdateChatDto
│   │   └── entities/
│   │       └── chat.entity.ts      # class Chat
│   │
│   ├── messages/          # Resource (plural)
│   │   ├── messages.controller.ts  # class MessagesController
│   │   ├── messages.service.ts     # class MessagesService
│   │   ├── messages.repository.ts  # class MessagesRepository
│   │   ├── dto/
│   │   │   └── create-message.dto.ts   # class CreateMessageDto
│   │   └── entities/
│   │       └── message.entity.ts       # class Message
│   │
│   └── attachments/       # Resource (plural, future)
│       ├── attachments.controller.ts   # class AttachmentsController
│       ├── attachments.service.ts      # class AttachmentsService
│       └── entities/
│           └── attachment.entity.ts    # class Attachment
│
└── user/
    ├── user.module.ts
    ├── users/
    │   ├── users.controller.ts         # class UsersController
    │   └── users.service.ts            # class UsersService
    └── entities/
        └── user.entity.ts              # class User
```

---

## 📝 **Quick Reference Table**

| Element         | Naming Rule          | Example                     |
| --------------- | -------------------- | --------------------------- |
| Domain folder   | singular, kebab-case | `chat/`, `user/`            |
| Resource folder | plural, kebab-case   | `messages/`, `attachments/` |
| File            | singular, kebab-case | `message.service.ts`        |
| DTO file        | kebab-case, action   | `create-message.dto.ts`     |
| Class name      | Singular, PascalCase | `MessageService`            |

---

## 🚫 **What to Avoid**

- Do **not** use plural for class names (`MessagesService` ❌).
- Do **not** mix singular and plural for the same type (`message/` and `messages/` together ❌).
- Do **not** use underscores or camelCase in filenames (`createMessage.dto.ts` ❌).

---

## ✅ **Summary**

- **Folders:** Domain (singular), Resource (plural)
- **Files & Classes:** Singular
- **Filenames:** kebab-case

Always follow this convention for all new code and when refactoring existing code.
