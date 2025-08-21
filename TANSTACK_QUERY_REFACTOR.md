# TanStack Query 重构总结

## 概述

本次重构将项目中的状态管理从 Zustand stores 迁移到 TanStack Query，提供了更好的数据获取、缓存和状态管理能力。

## 重构的组件

### 1. NewsletterFormCard
- **文件**: `src/components/settings/notification/newsletter-form-card.tsx`
- **重构内容**:
  - 使用 `useNewsletterStatus`, `useSubscribeNewsletter`, `useUnsubscribeNewsletter` hooks
  - 移除了手动的 `useState` 状态管理
  - 使用 TanStack Query 的自动缓存和错误处理

### 2. UsersPageClient
- **文件**: `src/components/admin/users-page.tsx`
- **重构内容**:
  - 使用 `useUsers` hook 进行数据获取
  - 移除了手动的数据获取逻辑和状态管理
  - 简化了组件逻辑

### 3. CreditsBalanceCard
- **文件**: `src/components/settings/credits/credits-balance-card.tsx`
- **重构内容**:
  - 使用 `useCreditStats` hook 获取信用统计信息
  - 移除了手动的 `fetchCreditStats` 函数
  - 使用 TanStack Query 的 `refetch` 功能

### 4. CreditTransactions
- **文件**: `src/components/settings/credits/credit-transactions.tsx`
- **重构内容**:
  - 使用 `useCreditTransactions` hook 进行分页数据获取
  - 移除了手动的数据获取和状态管理
  - 简化了组件逻辑

### 5. BillingCard
- **文件**: `src/components/settings/billing/billing-card.tsx`
- **重构内容**:
  - 使用 `useCurrentPlan` hook 获取支付和订阅信息
  - 移除了对 `usePayment` hook 的依赖
  - 使用 TanStack Query 的自动数据获取

### 6. UserDetailViewer
- **文件**: `src/components/admin/user-detail-viewer.tsx`
- **重构内容**:
  - 使用 `useBanUser`, `useUnbanUser` mutation hooks
  - 移除了对 `useUsersStore` 的依赖
  - 使用 TanStack Query 的自动缓存失效

## 新增的 Hooks

### 1. Newsletter Hooks (`src/hooks/use-newsletter.ts`)
- `useNewsletterStatus(email)` - 查询订阅状态
- `useSubscribeNewsletter()` - 订阅 newsletter
- `useUnsubscribeNewsletter()` - 取消订阅 newsletter

### 2. Users Hooks (`src/hooks/use-users.ts`)
- `useUsers(pageIndex, pageSize, search, sorting)` - 获取用户列表
- `useBanUser()` - 封禁用户
- `useUnbanUser()` - 解封用户

### 3. Credits Hooks (`src/hooks/use-credits-query.ts`)
- `useCreditBalance()` - 获取信用余额
- `useConsumeCredits()` - 消费信用
- `useCreditStats()` - 获取信用统计信息
- `useCreditTransactions(pageIndex, pageSize, search, sorting)` - 获取信用交易记录

### 4. Payment Hooks (`src/hooks/use-payment-query.ts`)
- `useActiveSubscription(userId)` - 获取活跃订阅
- `useLifetimeStatus(userId)` - 获取终身会员状态
- `useCurrentPlan(userId)` - 获取当前计划信息

## 简化的 Providers

### 1. PaymentProvider
- **文件**: `src/components/layout/payment-provider.tsx`
- **状态**: 已移除，TanStack Query 自动处理所有支付相关数据获取

### 2. CreditsProvider
- **文件**: `src/components/layout/credits-provider.tsx`
- **状态**: 已移除，TanStack Query 自动处理所有积分相关数据获取

## 更新的组件

### 1. UserButton
- **文件**: `src/components/layout/user-button.tsx`
- **更新**: 移除了 `resetState` 调用，TanStack Query 自动处理缓存失效

### 2. UserButtonMobile
- **文件**: `src/components/layout/user-button-mobile.tsx`
- **更新**: 移除了 `resetState` 调用，TanStack Query 自动处理缓存失效

### 3. SidebarUser
- **文件**: `src/components/dashboard/sidebar-user.tsx`
- **更新**: 移除了 `resetState` 调用，TanStack Query 自动处理缓存失效

### 4. CreditsBalanceButton
- **文件**: `src/components/layout/credits-balance-button.tsx`
- **更新**: 使用 `useCreditBalance` 替代 `useCredits`

### 5. CreditsBalanceMenu
- **文件**: `src/components/layout/credits-balance-menu.tsx`
- **更新**: 使用 `useCreditBalance` 替代 `useCredits`

### 6. ConsumeCreditCard
- **文件**: `src/ai/text/components/consume-credit-card.tsx`
- **更新**: 使用 `useCreditBalance` 和 `useConsumeCredits` 替代 `useCredits`

### 7. UpgradeCard
- **文件**: `src/components/dashboard/upgrade-card.tsx`
- **更新**: 使用 `useCurrentPlan` 替代 `usePayment`

### 8. CreditPackages
- **文件**: `src/components/settings/credits/credit-packages.tsx`
- **更新**: 使用 `useCurrentPlan` 替代 `usePayment`

### 9. CreditsBalanceCard
- **文件**: `src/components/settings/credits/credits-balance-card.tsx`
- **更新**: 使用 `useCurrentPlan` 替代 `usePayment`

## 配置

### 1. QueryClient 配置
- **文件**: `src/lib/query-client.ts`
- **配置**: 设置了合理的缓存时间和重试策略

### 2. QueryProvider
- **文件**: `src/components/providers/query-provider.tsx`
- **功能**: 提供 TanStack Query 上下文和开发工具

## 优势

### 1. 更好的缓存管理
- 自动缓存数据，减少不必要的网络请求
- 智能的缓存失效策略
- 支持乐观更新

### 2. 简化的状态管理
- 移除了大量的 `useState` 和 `useEffect`
- 自动处理加载和错误状态
- 统一的数据获取模式

### 3. 更好的用户体验
- 自动重试失败的请求
- 后台数据刷新
- 更流畅的加载状态

### 4. 开发体验提升
- 内置的开发工具支持
- 更好的错误处理
- 类型安全的数据获取

## 缓存策略

- **用户数据**: 30秒缓存，5分钟垃圾回收
- **信用数据**: 30秒缓存，5分钟垃圾回收
- **信用统计**: 1分钟缓存，10分钟垃圾回收
- **支付数据**: 2分钟缓存，5分钟垃圾回收
- **终身状态**: 5分钟缓存，10分钟垃圾回收

## 注意事项

1. 所有组件现在都使用 TanStack Query 进行数据获取
2. 移除了对 Zustand stores 的依赖（除了必要的全局状态）
3. 错误处理现在通过 TanStack Query 统一管理
4. 加载状态通过 `isLoading` 和 `isPending` 属性获取
5. 缓存失效通过 `invalidateQueries` 自动处理
6. 完全移除了 PaymentProvider 和 CreditsProvider
7. 删除了 use-payment.ts 和 payment-store.ts 文件

## 测试

- ✅ 所有组件编译通过
- ✅ TypeScript 类型检查通过
- ✅ 构建成功
- ✅ 代码格式化通过
