# Netlify Setup - Environment Variables

## Masla:
Courses production میں نظر نہیں آ رہے کیونکہ Supabase environment variables Netlify پر نہیں ہیں۔

## Fix کے لیے یہ کریں:

### Step 1: اپنی Netlify Site کھولیں
https://app.netlify.com/teams/{your-team}/sites/{your-site-name}

### Step 2: Site Settings جاؤ
- **Site settings** → **Build & deploy**

### Step 3: Environment Variables Add کریں
- **Environment** tab کھولیں
- **Edit variables** پر کلک کریں

### Step 4: یہ دونوں variables add کریں:

| Variable Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://yuzxkvytvrddnmjmgruy.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_JBsEL2knsHDwhNyYct_osA_WnrTSDrK` |

### Step 5: Deploy کریں
- **Deployments** میں جاؤ
- **Trigger deploy** پر کلک کریں

### Step 6: کسی بھی اور deployment کو trigger کریں
- ایک dummy commit GitHub پر کریں یا
- Netlify UI سے manually redeploy کریں

---

**ہو گیا؟ اب courses نظر آ جائیں گے!** ✅
