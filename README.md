# AI인터넷 — 로컬 실행 및 Railway 배포

Node.js/TypeScript + React/Vite + Express + PostgreSQL로 구성된 **pnpm 모노레포**입니다.
Python 프로젝트가 아니므로 `requirements.txt`는 필요하지 않습니다.

## 1. 준비 사항

- **Node.js 24 LTS 권장** — 지원 범위 `>=22.13 <25`
- **pnpm 10.26.1** — 루트 `package.json`의 `packageManager`에 고정
- PostgreSQL: 로컬에 직접 설치하거나 본인이 관리하는 외부 DB 사용
- 이미지/업로드 기능까지 사용하려면 본인 소유 Google Cloud Storage(GCS) 버킷과 인증 정보 필요

루트 폴더에서 모든 명령을 실행합니다. `artifacts/internet-gift`만 따로 가져가면
공유 패키지/API가 빠져 실행되지 않습니다. `artifacts`, `lib`, `scripts`,
`attached_assets`, 루트 설정 파일과 `pnpm-lock.yaml`을 함께 가져가세요.
`attached_assets`에는 실제 코드가 사용하는 원본 미디어가 있으므로 통째로 제외하지 않았습니다.
GitHub에 올리기 전 불필요한 업로드 자료와 큰 파일은 별도로 확인하세요.

```bash
corepack enable
corepack prepare pnpm@10.26.1 --activate
pnpm install --frozen-lockfile
```

Corepack이 설치되어 있지 않으면 Node.js 설치 환경에 맞게 Corepack을 설치하거나
`npm install --global pnpm@10.26.1`로 pnpm만 설치하세요. 프로젝트 의존성 설치는
`npm install`/`yarn`이 아닌 **pnpm**을 사용합니다.

Windows에서는 PowerShell을 사용할 수 있습니다. 기존 Linux 전용 설치 명령과
Mac/Windows 네이티브 빌드 패키지 제외 설정을 제거했습니다.
실제 Mac/Windows 실행은 별도 장비에서 검증하지 않았습니다.

## 2. 환경변수

실제 `.env`가 없는 프로젝트이므로 코드에서 사용하는 변수와 기존 설정의 변수 이름을
기준으로 비밀값 없는 `.env.example`을 제공합니다.

```bash
# macOS / Linux
cp .env.example .env
```

```powershell
# Windows PowerShell
Copy-Item .env.example .env
```

`.env`를 편집하여 다음 항목을 설정하세요.

| 변수 | 용도 |
| --- | --- |
| `DATABASE_URL` | 접속 가능한 PostgreSQL 연결 문자열. `CHANGE_ME`를 실제 본인 DB 정보로 변경 |
| `ADMIN_PASSWORD` | 대표 관리자 비밀번호. 최소 12자, 기본값 사용 금지 |
| `TOKEN_SECRET` | 관리자 인증 서명용 임의 문자열. 최소 32자 |
| `PORT` | 로컬 기본값 `3000`. Railway에서는 플랫폼이 주입하는 값 사용 |
| `VITE_PUBLIC_SITE_URL` | 외부로 복사되는 글/이미지의 공개 사이트 주소. 로컬은 `http://localhost:3000`, 배포 시 실제 공개 도메인 |
| `LOG_LEVEL` | 기본 `info` |

`pnpm start`/`pnpm dev`는 DB 및 관리자 인증 설정이 빠지거나 약하면 실행을 중단합니다.
코드에 남아 있는 레거시 인증 기본값에 의존하지 마세요.
`SESSION_SECRET`과 `TOKEN_SECRET`은 다른 이름입니다. 현재 관리자 인증은 `TOKEN_SECRET`을 사용합니다.

`pnpm` 루트 실행 스크립트가 `.env`를 읽습니다. **이미 운영체제/Railway에 설정된 변수가 우선**입니다.
API 패키지의 `start`를 직접 실행하면 이 `.env` 로딩과 검증을 거치지 않으므로,
아래에 안내된 **루트 명령**을 사용하세요.

`VITE_*`는 빌드 결과에 공개됩니다. API 키, 비밀번호, DB 연결 문자열은 절대 넣지 마세요.
공개 도메인을 변경한 경우 `VITE_PUBLIC_SITE_URL`을 수정하고 다시 빌드합니다.

## 3. 데이터베이스 준비

빈 PostgreSQL 데이터베이스를 만들고 `.env`의 `DATABASE_URL`을 지정한 다음:

```bash
pnpm db:push
```

이 명령은 `.env`/환경변수의 **현재 대상 DB에 스키마 변경을 적용**합니다.
대상을 확인하고, 기존 데이터가 있는 DB는 먼저 백업하세요. 데이터 삭제 확인이 나타나면
무조건 승인하거나 `--force`로 진행하지 말고 변경 내용을 검토하세요.

- 기존 Replit DB를 이 작업에서 변경하거나 다른 DB로 교체하지 않습니다.
- DB 데이터는 소스코드나 GitHub 저장소에 포함되지 않습니다.
- 기존 상담/신청/관리자 계정/글 수정 내역을 유지하려면 별도 PostgreSQL 백업·복원이 필요합니다.
- 새 빈 DB는 최초 서버 실행 시 내장 꿀팁 데이터와 일회성 게시일/이미지 경로/조회수 초기화가 적용됩니다.
  이 초기 데이터는 **기존 운영 DB 전체의 백업이 아닙니다**.
- 시작 명령은 DB 스키마를 자동 변경하지 않습니다. 스키마 변경은 별도로 검토·적용합니다.

## 4. 로컬 실행

설치, `.env` 설정, DB 스키마 준비를 완료한 뒤:

```bash
pnpm build
pnpm start
```

또는 빌드 후 개발 모드 서버를 한 번에 실행:

```bash
pnpm dev
```

접속: **http://localhost:3000** (`PORT`를 바꾸면 해당 포트 사용)

| 경로 | 서비스 |
| --- | --- |
| `/` | AI인터넷 웹사이트 |
| `/admin` | 관리자 로그인 |
| `/api/healthz` | 서버 상태 확인 |
| `/youtube-analyzer/` | YouTube 트렌드 분석기 |
| `/internet-promo/` | 인터넷 가입홍보 2 |
| `/internet-promo-v1/` | 인터넷 가입홍보 1 |

루트 실행은 **Express 서버 한 개**가 API와 빌드된 웹 앱을 함께 제공합니다.
Replit의 경로 분배 프록시가 없어도 동작합니다.
`pnpm dev`도 빌드된 화면을 제공하므로 HMR은 제공하지 않습니다.
코드 수정 후 종료하고 `pnpm dev`를 다시 실행하거나 `pnpm build && pnpm start`를 실행하세요.

Replit 내부의 기존 아티팩트 개발 워크플로는 그대로 유지됩니다.
디자인 전용 `mockup-sandbox`는 외부 배포 대상에서 제외했습니다.

빌드와 DB 준비 후 `pnpm test:portable`로 Replit 런타임 변수 없이 서버를 잠시 실행하여
화면/JS 파일/API 경로와 관리자 접근 보호를 점검할 수 있습니다.
이 점검은 GCS/Drive 인증이나 실제 Railway 배포를 대신하지 않습니다.

## 5. 이미지와 업로드: Replit 밖에서는 별도 이전 필요

Replit App Storage의 자격증명은 Replit 내부 사이드카에 의존하므로 Railway에서 그대로 사용할 수 없습니다.
DB에 저장된 이미지 경로만 복사해도 실제 이미지 파일은 이동하지 않습니다.

외부 실행용으로 Google Cloud Storage 인증 방식을 지원합니다:

```dotenv
OBJECT_STORAGE_BACKEND=gcs
GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID
PUBLIC_OBJECT_SEARCH_PATHS=/YOUR_BUCKET/public
PRIVATE_OBJECT_DIR=/YOUR_BUCKET/private
```

인증 방법은 다음 중 하나를 선택합니다.

1. **로컬:** 서비스 계정 JSON 파일을 Git 밖에 보관하고 `GOOGLE_APPLICATION_CREDENTIALS`에 파일 경로 지정.
2. **Railway:** `GCS_CREDENTIALS_JSON`에 서비스 계정 JSON 전체를 **비밀 변수**로 등록.
   Railway에는 로컬 PC의 파일 경로를 설정하지 마세요.
3. 이미 구성된 Google Application Default Credentials를 사용할 수도 있지만,
   서명 업로드 URL을 만들 수 있는 서명 권한/자격증명이 필요합니다.

서비스 계정에는 필요한 버킷의 객체 읽기·쓰기 및 앱이 사용하는 메타데이터 수정 권한을 부여하세요.
브라우저가 서명 URL로 직접 업로드하므로 버킷 CORS에 로컬/운영 사이트의 origin과
실제 사용하는 `PUT`, `GET`, `HEAD` 및 `Content-Type`을 허용해야 합니다.

**기존 App Storage의 공개·비공개 객체를 새 버킷으로 별도 복사해야 합니다.**
`tip-covers/...`, 업로드 파일의 상대 경로 및 비공개 객체의 커스텀 ACL 메타데이터를 보존하세요.
Replit의 버킷 ID를 Railway 변수에 복사하는 것만으로는 인증/이전되지 않습니다.
이전 및 인증이 없으면 앱은 실행되어도 해당 이미지·업로드 기능은 실패할 수 있습니다.

Replit에서는 변수를 지정하지 않으면 기존 Replit Storage 방식을 유지합니다.
Railway로 `REPL_ID` 등의 Replit 런타임 변수를 복사하지 마세요.

### Google Drive 및 알림

- **Google Drive:** 현재 전자동의서 자동 저장은 `@replit/connectors-sdk`의 연결된 계정에 의존합니다.
  해당 연결/OAuth 인증은 GitHub 또는 Railway로 자동 이전되지 않습니다.
  외부 배포에서는 별도 Google Drive 인증 구현이 필요합니다.
  현재는 동의 내역 DB 저장을 유지하고 Drive 실패 시 관리자 PDF 다운로드를 사용합니다.
  GCS 서비스 계정 설정은 Drive 커넥터 인증을 대신하지 않습니다.
- **SOLAPI:** 카카오 알림을 사용하려면 `.env.example`의 `SOLAPI_*` 변수를 등록하고
  발신번호/채널/템플릿 승인을 별도로 확인하세요.
- **Telegram:** 사용 시 `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`를 설정합니다.
- 외부 연동이 구성되지 않았다면 해당 알림/저장 기능까지 정상 작동한다고 가정하지 마세요.

## 6. GitHub에 올리기 전 보안 확인

`.gitignore`는 의존성, 빌드 결과, `.env*`(예제 제외), `.replit`, `.config`,
로컬 캐시, 에이전트 메모, 인증 키 파일, 백업 및 진단 출력 등을 제외합니다.
`pnpm-lock.yaml`과 `.env.example`은 커밋해야 합니다.

**주의: `.gitignore`는 과거 커밋 이력을 지우지 않습니다.**
기존에 추적하던 Replit 설정과 로컬 에이전트 자료는 파일을 지우지 않고 Git 추적에서 제외합니다.
이전에 커밋한 비밀번호·토큰은 교체하고, GitHub 공개 전 과거 이력을 검토하세요.
현재 변경만 커밋해도 기존 이력 안의 비밀값은 남아 있을 수 있습니다.

처음 공개할 때는 기존 `.git`을 지우지 말고 별도 보관하세요.
비밀 파일과 `.git`을 제외한 현재 소스만 **새 폴더**로 복사하여 새 저장소를 만드는 방법을 권장합니다.
`.env`·인증 JSON·개인 업로드 자료를 새 폴더에 포함하지 마세요.

```bash
# 깨끗한 새 소스 폴더에서
git init
git add .
git status
# 추가된 파일을 직접 확인한 뒤
git commit -m "Prepare portable Node.js app"
git branch -M main
git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_REPOSITORY.git
git push -u origin main
```

이 프로젝트에 다른 파일이 이미 추적되고 있다면 `.gitignore`만 추가해서는 제외되지 않습니다.
필요한 파일에 한해 `git rm --cached FILE`을 사용하고, 실제 소스나 원본 미디어는 제거하지 마세요.
기존 커밋 이력을 재작성하는 작업은 자동으로 수행하지 않습니다.

## 7. Railway 배포

GitHub 연결 및 Railway에서의 실제 배포는 사용자가 진행합니다. 이 설정 작업은 배포를 실행하지 않습니다.

1. Railway에서 GitHub 저장소를 연결합니다.
2. **서비스 Root Directory는 저장소 루트**로 둡니다. `artifacts/internet-gift`로 지정하지 마세요.
3. Node.js/pnpm을 감지하는 **Railpack** 빌더를 사용합니다.
4. PostgreSQL 서비스를 추가하거나 본인이 관리하는 외부 PostgreSQL을 연결합니다.
5. 앱 서비스의 Variables에서 다음을 설정합니다.

| 변수 | Railway 설정 |
| --- | --- |
| `DATABASE_URL` | DB 서비스의 연결 문자열 참조. 서비스 이름이 `Postgres`인 경우 `${{Postgres.DATABASE_URL}}` |
| `ADMIN_PASSWORD` | 본인이 정한 새 강력한 비밀번호, 최소 12자 |
| `TOKEN_SECRET` | 새 임의 문자열, 최소 32자 |
| `NODE_ENV` | `production` |
| `VITE_PUBLIC_SITE_URL` | 생성한 Railway 공개 도메인 또는 검증된 커스텀 도메인 |
| `OBJECT_STORAGE_BACKEND` | `gcs` |
| `GCS_CREDENTIALS_JSON` 및 저장소 경로 | 이미지/업로드 사용 시 앞 절에 따라 설정 |
| `SOLAPI_*`, `TELEGRAM_*` | 해당 기능을 사용할 경우에만 등록 |

설치/실행 설정:

```text
Install Command (별도 지정이 가능한 경우): pnpm install --frozen-lockfile
Build Command: pnpm build
Start Command: pnpm start
Healthcheck Path: /api/healthz
```

Railpack의 자동 설치를 사용하는 경우 별도 Install Command 필드는 필요하지 않습니다.
빌드는 TypeScript/Vite/esbuild 등 개발 의존성도 필요하므로 **설치 단계에서
`--prod`나 `--omit=dev`로 개발 의존성을 제외하지 마세요.**
저장소의 `.npmrc`에서 `production=false`를 지정해 빌드 도구를 함께 설치합니다.
서비스에 별도 설치 옵션이 있다면 `pnpm install --frozen-lockfile --prod=false`를 사용하세요.

**`PORT`를 고정할 필요가 없습니다.** 앱은 Railway가 주입한 `PORT`를 사용하며,
서버는 외부 연결을 받을 수 있도록 바인딩됩니다.
공개 도메인을 생성하고 `/api/healthz`와 `/`를 확인하세요.

DB 스키마는 앱 첫 실행 **전에** 준비합니다. 로컬에서 Railway DB를 관리할 때는
내부 전용 호스트가 아닌 **외부 접속 가능한 DB URL**을 사용하세요.
해당 URL로 `.env`를 구성하고 `pnpm db:push`를 실행하거나, 기존 DB를 백업·복원합니다.
기존 운영 DB에 대해 실행하기 전 반드시 대상 확인과 백업이 필요합니다.

최초 배포에서 도메인을 생성한 뒤 `VITE_PUBLIC_SITE_URL`을 바꿨다면 다시 빌드/배포하세요.
빌드와 서버 실행 과정은 SQL 스키마를 자동 변경하지 않습니다.

공식 문서:
- https://docs.railway.com/deployments/monorepo
- https://docs.railway.com/builds/build-configuration

## 8. 자주 발생하는 문제

- **PORT/BASE_PATH 오류:** 루트 `pnpm build`/`pnpm start` 사용. 빌드가 각 앱 경로를 설정합니다.
- **Missing build:** `pnpm build`를 먼저 실행하세요.
- **테이블이 없다는 오류:** 대상 DB 및 스키마 적용 여부 확인.
- **관리자 인증 설정 오류:** `.env`의 `ADMIN_PASSWORD`, `TOKEN_SECRET`을 확인하세요.
- **이미지 500/권한 오류:** GCS 객체 이전, 인증, 경로, IAM 및 버킷 CORS 확인.
- **Drive 업로드 실패:** Replit 연결 계정은 외부 호스팅으로 자동 이전되지 않습니다.
- **Mac/Windows 네이티브 모듈 오류:** 다른 OS의 `node_modules`를 복사하지 말고 현재 OS에서 pnpm 설치.

실제 DB 자격증명, 서비스 계정, 사용자 데이터는 이 README나 예제 환경파일에 포함하지 않습니다.
