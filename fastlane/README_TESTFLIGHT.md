Fastlane TestFlight upload

What I created
- `fastlane/Fastfile` — lane `beta` builds the iOS app and uploads to TestFlight using an App Store Connect API key.
- `fastlane/Appfile` — uses environment variables for `APP_IDENTIFIER`, `APPLE_ID`, and `TEAM_ID`.

Credentials / files you need (recommended: use App Store Connect API Key)
- App Store Connect API Key (.p8 file)
  - `APP_STORE_CONNECT_KEY_PATH` — local path to the `.p8` file (e.g. `fastlane/AuthKey_ABC123.p8`)
  - `APP_STORE_CONNECT_KEY_ID` — Key ID shown in App Store Connect (e.g. `ABC123DEF`) 
  - `APP_STORE_CONNECT_ISSUER_ID` — Issuer ID (UUID) for your App Store Connect API key
- `TEAM_ID` — your Apple Developer Team ID (10‑character ID)
- `APP_IDENTIFIER` — bundle identifier (e.g. `com.yourcompany.choona`)
- `SCHEME` — Xcode scheme to build (defaults to `Choona`)

Optional (if you prefer username/password flows)
- `APPLE_ID` — Apple ID email address
- An app‑specific password is not needed when using API key, but Fastlane also supports user/password flows.

Security note
- Do NOT commit your `.p8` private key into the repo. Place it locally and set `APP_STORE_CONNECT_KEY_PATH` to its path, or use a CI secret store.

Setup steps (macOS)
1. Install Ruby tooling (if not already):

```bash
brew install ruby
```

2. Install Fastlane (system or Bundler). Using Bundler is recommended:

```bash
gem install bundler
bundle init
# add `gem "fastlane"` to Gemfile, then:
bundle install
```

Or install system-wide:

```bash
sudo gem install fastlane -NV
```

3. Place your App Store Connect API key file (AuthKey_*.p8) somewhere safe, e.g. `fastlane/AuthKey.p8`.

4. Export environment variables (example):

```bash
export APP_IDENTIFIER="com.yourcompany.choona"
export APPLE_ID="you@company.com"
export TEAM_ID="YOURTEAMID"
export SCHEME="Choona"
export APP_STORE_CONNECT_KEY_PATH="$PWD/fastlane/AuthKey.p8"
export APP_STORE_CONNECT_KEY_ID="ABC123DEF"
export APP_STORE_CONNECT_ISSUER_ID="00000000-0000-0000-0000-000000000000"
```

5. Install iOS native deps and pods:

```bash
cd ios
pod install
cd ..
```

6. Build and upload to TestFlight:

If using Bundler:

```bash
bundle exec fastlane beta
```

If installed system-wide:

```bash
fastlane beta
```

Troubleshooting
- If the build fails due to signing: ensure the provisioning profiles/certificates exist for the `APP_IDENTIFIER`. You can use `match` (Fastlane) or create provisioning profiles in the Apple Developer portal.
- If you prefer `match`, I can add a `Matchfile` and instructions to configure a secure Git repo for certificates.

Want me to:
- Add `match` configuration for automatic code signing (requires a private Git repo for certs), or
- Create a CI pipeline (GitHub Actions) that runs `fastlane beta` using encrypted secrets?

Fastlane `match` (automatic code signing)
---------------------------------------
If you want Fastlane to manage provisioning profiles and certificates for you, `match` stores them in a private Git repo and keeps them in sync across machines/CI.

You will need:
- A private Git repository to store certificates/profiles. Set its URL in `MATCH_GIT_URL` (e.g. `git@github.com:yourorg/fastlane-certs.git`).
- A password for the repo (optional encryption) set as `MATCH_PASSWORD` (Fastlane will use this to encrypt the certificates with OpenSSL if configured).

Environment variables used by `match`:
- `MATCH_GIT_URL` — URL to the private git repo for certificates
- `MATCH_GIT_BRANCH` — optional branch name (defaults to repo default)
- `MATCH_PASSWORD` — password used to encrypt/decrypt certificates (recommended)
- `MATCH_READONLY` — set to `true` in CI if you only want to fetch (not push)

How it works (high level):
1. Locally run `fastlane match init` to prepare the repo (or I can do this for you if you provide access).
2. Install certificates/profiles by running `fastlane match appstore` (or `match(type: "appstore")` in the Fastfile). Fastlane will commit certs to the private repo.
3. CI machines set `MATCH_READONLY=true` and `MATCH_GIT_URL` and will fetch certs during the build.

Security notes:
- Do NOT make the certs repo public.
- Store `MATCH_PASSWORD` in your CI secrets, not in the repo.

I added a `fastlane/Matchfile` and updated the `Fastfile` to run `match` automatically when `MATCH_GIT_URL` is set. Follow the README steps above to configure the repo and environment vars.

CI: GitHub Actions (optional)
---------------------------------
You can run `match` automatically from CI to fetch provisioning profiles and certificates. I added a template workflow at `.github/workflows/fastlane_match.yml`.

Required GitHub repository secrets (set these in the repo Settings → Secrets):
- `MATCH_GIT_URL` — SSH or HTTPS URL of your private certs repo (e.g. git@github.com:org/fastlane-certs.git)
- `MATCH_GIT_SSH_KEY` — private SSH key (only if using SSH URL). Add the corresponding public key as a deploy key to the certs repo.
- `MATCH_PASSWORD` — passphrase used to encrypt the certs (optional but recommended)
- `APP_STORE_CONNECT_KEY` — Base64-encoded contents of your App Store Connect API `.p8` file
- `APP_STORE_CONNECT_KEY_ID` — Key ID from App Store Connect
- `APP_STORE_CONNECT_ISSUER_ID` — Issuer ID from App Store Connect
- `APP_IDENTIFIER` — app bundle id (e.g. `com.yourcompany.choona`)
- `APPLE_ID` — your Apple ID email
- `TEAM_ID` — Apple Developer Team ID
- `MATCH_GIT_BRANCH` — optional branch
- `MATCH_READONLY` — set `true` for CI read-only fetches

How the workflow works
1. The workflow writes `APP_STORE_CONNECT_KEY` into `fastlane/AuthKey.p8` (decoded from base64).
2. If `MATCH_GIT_SSH_KEY` is provided, it starts an `ssh-agent` so the runner can access the private certs repo.
3. It installs gems, then runs `bundle exec fastlane match appstore` to sync the profiles and certs.

Triggering the workflow
- The workflow is set to run on `push` to `main` and via manual `workflow_dispatch`. You can modify triggers as needed.

Security notes
- Keep `MATCH_GIT_URL` private and do NOT commit credentials into the repo.
- Use a deploy key with restricted access to the certs repo for CI (`MATCH_GIT_SSH_KEY`).

Tell me which option you prefer and whether you want me to add `match` or CI files.