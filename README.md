# 安裝步驟
git clone https://github.com/fxp528/backend_test.git

cd backend_test

npm ci

# 測試假資料展示結果
npm run test:mock

# 建立新的分支
1. 請先切換分支
> git checkout develop
2. 建立新分支
> git branch feature/implement-service-index
3. 切換至新的分支
> git checkout feature/implement-service-index

# 請實作 src/services/index.js

# 測試
npm run test

# 完成後整合到develop分支
1. 先建立commit，於根目錄
> git add .
> git commit -m "implement service index.js"

2. 切換至develop
> git checkout develop

3. 執行merge
> git merge feature/implement-service-index

4. 推送develop
> git push
>> 可能會需要登入，密碼需要到 https://github.com/settings/tokens 建立新的token用於登入

5. 可選：移除feature/implement-service-index
> git branch -d feature/implement-service-index
