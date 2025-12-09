Cấu trúc dự án

# File Tree: chat-app

**Generated:** 12/8/2025, 3:51:13 PM
**Root Path:** `p:\Nodejs\chat-app`

```
├── 📁 client
│   ├── 📁 public
│   ├── 📁 src
│   │   ├── 📁 components
│   │   │   └── 📁 ui # thư viện component từ shadcn ui
│   │   ├── 📁 config
│   │   │   └── 📄 envConfig.ts # cấu hình môi trường
│   │   ├── 📁 constants
│   │   │   ├── 📄 event.const.ts # event socket io
│   │   │   └── 📄 link.const.ts # link
│   │   ├── 📁 hooks
│   │   ├── 📁 lib
│   │   │   ├── 📁 request # thư viện request
│   │   │   │   ├── 📄 axios.helper.ts
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 request.type.ts
│   │   │   │   └── 📄 upload.helper.ts
│   │   │   ├── 📄 schema.common.ts # schema chung
│   │   │   └── 📄 utils.ts
│   │   ├── 📁 routes
│   │   │   ├── 📁 private
│   │   │   ├── 📁 unauthenticated
│   │   │   └── 📄 welcome.tsx
│   │   ├── 📁 services # Cung cấp interface các data từ server, các function call api
│   │   │   ├── 📁 templates
│   │   │   │   ├── 📄 index.ts # logic call api
│   │   │   │   ├── 📄 module_name.req.ts # request dto
│   │   │   │   ├── 📄 module_name.res.ts # response dto
│   │   │   │   └── 📄 module_name.schema.ts # zod schema
│   │   │   ├── 📁 auth
│   │   │   ├── 📁 chats
│   │   │   ├── 📁 media
│   │   │   ├── 📁 messages
│   │   │   ├── 📁 protected
│   │   │   ├── 📁 user
│   │   │   ├── 📄 api.types.ts # type api
│   │   │   └── 📄 request.interface.ts # interface request
│   │   ├── 📁 types
│   │   ├── 🎨 app.css
│   │   ├── 📄 root.tsx
│   │   ├── 📄 routes.ts
│   │   └── 📄 vite-env.d.ts
│   ├── ⚙️ .dockerignore
│   ├── ⚙️ .editorconfig
│   ├── ⚙️ .env.example
│   ├── ⚙️ .gitignore
│   ├── ⚙️ .prettierrc
│   ├── 🐳 Dockerfile
│   ├── 📝 README.md
│   ├── ⚙️ components.json
│   ├── 📄 eslint.config.ts
│   ├── ⚙️ package-lock.json
│   ├── ⚙️ package.json
│   ├── 📄 react-router.config.ts
│   ├── ⚙️ tsconfig.json
│   └── 📄 vite.config.ts
├── 📁 docs # Tài liệu mô tả dự án, một số flow đặc biệt
├── 📁 server
│   ├── 📁 prisma
│   │   └── 📄 schema.prisma # Tất cả các model trong dự án
│   ├── 📁 src
│   │   ├── 📁 config
│   │   │   └── 📄 env-config.ts
│   │   ├── 📁 core
│   │   │   ├── 📄 access-token.middleware.ts # middleware xác thực token
│   │   │   ├── 📄 exceptions.ts # các exception
│   │   │   ├── 📄 form-data.middleware.ts # middleware xử lý form data
│   │   │   ├── 📄 handler-exception.ts # xử lý exception
│   │   │   ├── 📄 local-file.service.ts # service xử lý file
│   │   │   ├── 📄 media.exception.ts # exception media
│   │   │   ├── 📄 rate-limit.middleware.ts # middleware giới hạn tần suất
│   │   │   ├── 📄 routes.const.ts # constant route
│   │   │   ├── 📄 status-code.ts # status code
│   │   │   └── 📄 validate.middleware.ts # middleware validate dùng zod
│   │   ├── 📁 lib
│   │   │   ├── 📁 database
│   │   │   │   ├── 📄 base-controller.ts # controller cơ bản
│   │   │   │   ├── 📄 base-service.ts # service cơ bản
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 prisma-exception.ts
│   │   │   │   └── 📄 prisma.service.ts
│   │   │   ├── 📄 hashing.service.ts
│   │   │   ├── 📄 jwt.service.ts
│   │   │   ├── 📄 logger.service.ts
│   │   │   ├── 📄 mailler.service.ts
│   │   │   ├── 📄 paginate-cusor.ctrl.ts
│   │   │   ├── 📄 redis.service.ts
│   │   │   ├── 📄 s3.service.ts
│   │   │   ├── 📄 schema.common.ts
│   │   │   └── 📄 utils.ts
│   │   ├── 📁 routes
│   │   │   ├── 📁 templates
│   │   │   │   ├── 📄 module_name.controller.ts # controller chỉ xử lý nhận request và trả response
│   │   │   │   ├── 📄 module_name.db.ts # các quy định interface thao tác với db
│   │   │   │   ├── 📄 module_name.req.dto.ts # request dto
│   │   │   │   ├── 📄 module_name.res.dto.ts # response dto
│   │   │   │   ├── 📄 module_name.route.ts # route
│   │   │   │   ├── 📄 module_name.schema.ts # zod schema
│   │   │   │   └── 📄 module_name.service.ts # service truy vấn đến prisma, xử lý logic
│   │   │   ├── 📁 media # module đặc biệt, ngoài xử lý http còn xử lý queue, xử lý file,...
│   │   │   │   ├── 📄 ffmpeg.service.ts
│   │   │   │   ├── 📄 media.ctrl.ts
│   │   │   │   ├── 📄 media.db.ts
│   │   │   │   ├── 📄 media.queue.ts
│   │   │   │   ├── 📄 media.req.ts
│   │   │   │   ├── 📄 media.res.ts
│   │   │   │   ├── 📄 media.route.ts
│   │   │   │   ├── 📄 media.schema.ts
│   │   │   │   └── 📄 media.service.ts
│   │   │   ├── 📁 auth
│   │   │   ├── 📁 chat
│   │   │   ├── 📁 friend
│   │   │   ├── 📁 message
│   │   │   ├── 📁 oauth2
│   │   │   ├── 📁 protected
│   │   │   ├── 📁 user
│   │   ├── 📁 socket
│   │   │   ├── 📄 event.const.ts
│   │   │   └── 📄 index.ts
│   │   ├── 📁 types
│   │   │   └── 📄 express.d.ts
│   │   └── 📄 index.ts
│   ├── 📁 uploads  # upload local file
│   ├── ⚙️ .editorconfig
│   ├── ⚙️ .env.example
│   ├── ⚙️ .gitignore
│   ├── ⚙️ .prettierrc
│   ├── ⚙️ nodemon.json
│   ├── ⚙️ package-lock.json
│   ├── ⚙️ package.json
│   ├── 📄 prisma.config.ts
│   └── ⚙️ tsconfig.json
├── ⚙️ .gitignore
└── ⚙️ docker-compose.yml
```
