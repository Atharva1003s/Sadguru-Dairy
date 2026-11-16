# 🥛 सद्गुरू दुग्धालय - दैनिक दूध रतीब व्यवस्थापन प्रणाली
### Sadguru Dairy - Daily Milk Delivery Register & Management System (MERN Stack)

---

## 📌 प्रकल्प परिचय (Overview)
हे ॲप्लिकेशन खास **सद्गुरू दुग्धालय (Sadguru Dairy)** चे चालक, मालक व व्यवस्थापकांसाठी तयार करण्यात आले आहे. सर्व व्यवहार, नोंदणी, आणि हिशोब मालक एकाच मध्यवर्ती डॅशबोर्डवरून हाताळू शकतात.

यात तुमच्या वहीतील **सर्व ९४ ग्राहकांची नावे** त्यांच्या मूळ अनुक्रमानुसार (Serial No 1 to 94) आणि **गाय दूध (Cow Milk)** व **म्हैस दूध (Buffalo Milk)** या विभागणीनुसार उपलब्ध आहेत.

---

## 🚀 मुख्य विभाग (Unified Operator Dashboard Features)

### १. रतीबाची वही (Digital Register Book)
- तुमच्या ५ फोटोमधील वहीचा हुबेहूब डिजिटल तक्ता.
- डावीकडे ग्राहकाचे नाव आणि वही क्रमांक स्थिर (Sticky Columns).
- १ ते ३१ तारखांचे कॉलम्स.
- कोणत्याही तारखेवर किंवा ग्राहकावर क्लिक करून लगेच दूध बदलता येते.
- **शेवटी एकूण लिटर, दर आणि एकूण रक्कम स्वयंचलित मोजली जाते.**
- **तळाशी सारांश ओळी (Notebook Red Ink Summary):**
  - एकूण गाय दूध (Cow Milk Daily & Monthly Total)
  - एकूण म्हैस दूध (Buffalo Milk Daily & Monthly Total)
  - एकूण सर्व दूध (Grand Total Milk & Revenue ₹)
- **१-क्लिकने आजचे सर्व रतीब भरा (Auto-fill Today's Deliveries).**
- **वही प्रिंट करा / PDF सेव्ह करा.**

### २. दैनिक रतीब नोंद (Daily Milk Entry)
- तारीख निवडा (डिफॉल्ट आजची तारीख).
- ग्राहक निवडा (वही क्र. किंवा नावाने).
- **१-क्लिक बटणे:** `०.५ L`, `१.० L`, `१.५ L`, `२.० L`, `२.५ L`, `३.० L`, किंवा `सुट्टी / ० L (+)`.
- कस्टम लिटर टाकण्याची सोय.
- एका ग्राहकाचे दूध नोंदवल्यावर लगेच पुढील ग्राहकावर स्वयंचलित पुढे जाण्याची सोय!

### ३. ग्राहक मासिक तपशील व कॅलेंडर (Customer Ledger & Calendar)
- कोणताही ग्राहक निवडून त्याचा संपूर्ण १ ते ३१ दिवसांचा वैयक्तिक कॅलेंडर तक्ता, घेतलेले एकूण दूध, दर, बिल आणि सुट्ट्यांचे दिवस पाहता येतात.
- वैयक्तिक पावती प्रिंट करण्याची सोय.

### ४. ग्राहक व्यवस्थापन (Customer Directory)
- नवीन ग्राहक जोडणे (+ Add Customer).
- ग्राहकाचे नाव (मराठी/English), फोन, वही क्र., गाय/म्हैस प्रकार, नियमित लिटर व खास दर बदलणे.
- ग्राहक निष्क्रिय करणे.

### ५. मासिक बिले व WhatsApp (Billing & WhatsApp)
- सर्व ग्राहकांची मासिक बिले.
- एका क्लिकवर ग्राहकाला WhatsApp वर थेट मराठीत/इंग्रजीत बिल पाठवणे.
- बिल पावती प्रिंट करणे (ज्यावर UPI ID सुद्धा छापून येतो).

### ६. दर व सेटिंग्ज (Rates & Settings)
- गाय दूध दर (₹/L) आणि म्हैस दूध दर (₹/L) बदलणे.
- डेअरीचे नाव (**सद्गुरू दुग्धालय / Sadguru Dairy**), टॅगलाईन, संपर्क फोन व UPI ID बदलणे.
- आवश्यक असल्यास मूळ ग्राहक रीसीड करणे.

---

## 🔐 Operator Login Details

- **Username:** `admin`
- **Password:** `admin`

---

## 🌐 Language Switcher
- In the top right header, click **`English ⇄ मराठी`** anytime to toggle the entire application between English and Marathi.

---

## 📱 Mobile App & Free Cloud Deployment Guide

Follow these 4 simple steps to deploy online for free and install the app on your mobile phone:

### Step 1: Free Cloud Database (MongoDB Atlas)
1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Click **Create a Deployment** and select the **Free (M0)** tier (forever free, 512 MB).
3. Under **Security Quickstart**:
   - Create a database user (e.g. username: `admin`, password: `YourStrongPassword123`).
   - Under **IP Access List**, add `0.0.0.0/0` (Allow Access from Anywhere).
4. Click **Connect** -> **Drivers** -> Copy the connection string:
   `mongodb+srv://admin:<password>@cluster0.xxxx.mongodb.net/sadguru_dairy?retryWrites=true&w=majority`
   *(Replace `<password>` with your database user password)*.

---

### Step 2: Push Your Code to GitHub
1. Create a free GitHub account at [https://github.com](https://github.com) if you don't already have one.
2. Create a new repository named `sadguru-dairy`.
3. In your project terminal, run:
   ```bash
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/sadguru-dairy.git
   git branch -M main
   git push -u origin main
   ```

---

### Step 3: Free Cloud Backend (Render.com)
1. Go to [https://render.com](https://render.com) and log in with GitHub.
2. Click **New +** -> **Web Service**.
3. Select your `sadguru-dairy` repository.
4. Fill in these settings:
   - **Name:** `sadguru-dairy-api`
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
5. Scroll down to **Environment Variables** and add:
   - `MONGO_URI`: *(Paste your MongoDB Atlas connection string from Step 1)*
   - `JWT_SECRET`: `sadguru_dairy_secure_key_2026`
6. Click **Deploy Web Service**.
7. Once deployed, Render will give you a live URL, for example:
   `https://sadguru-dairy-api.onrender.com`
   *(On first run, it automatically seeds your admin account and all 49 customers!)*

---

### Step 4: Free Cloud Frontend (Vercel.com)
1. Go to [https://vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New...** -> **Project**.
3. Import your `sadguru-dairy` repository.
4. In the configuration screen:
   - **Root Directory:** Click edit and select `client`.
   - **Framework Preset:** `Vite`
   - Expand **Environment Variables** and add:
     - Key: `VITE_API_URL`
     - Value: `https://sadguru-dairy-api.onrender.com/api` *(Your Render backend URL followed by `/api`)*
5. Click **Deploy**.
6. Within 1 minute, Vercel gives you your live app URL, for example:
   `https://sadguru-dairy.vercel.app`

---

### 📲 How to Install on Your Mobile Phone (Like Any Native App)
1. Open your live Vercel URL (`https://sadguru-dairy.vercel.app`) in **Google Chrome** on your Android phone (or **Safari** on iPhone).
2. **On Android:**
   - Tap the **3 dots** (menu) at top right.
   - Tap **"Add to Home screen"** or **"Install app"**.
   - Tap **Install**.
3. **On iPhone:**
   - Tap the **Share** button (box with upward arrow) at bottom.
   - Tap **"Add to Home Screen"**.
4. The **सद्गुरू दुग्धालय (Sadguru Dairy)** icon is now on your phone screen! Tap it anytime to open in full screen without browser bars.
