import { createFileRoute } from "@tanstack/react-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  TrendingUp,
  FileText,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react"
import { Bar, BarChart, Line, LineChart, Cell, Pie, PieChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { customerMock } from "@/mock/customer"
import { opportunityMock } from "@/mock/opportunity"
import { contractMock } from "@/mock/contract"
import { getDictLabel, getBadgeClassName } from "@/lib/dict"

export const Route = createFileRoute("/")({
  component: Dashboard,
})

// Mock activity timeline data
const activityData = [
  { id: "1", action: "新建商机", entity: "浙江华丰 - 梭织面料追加订单", user: "销售员小王", time: "10分钟前" },
  { id: "2", action: "合同签约", entity: "浙江华丰 - 胚布采购意向书", user: "销售员小李", time: "30分钟前" },
  { id: "3", action: "回款到账", entity: "越南光明 - 再生棉纱出口合同", user: "财务小张", time: "2小时前" },
  { id: "4", action: "客户拜访", entity: "江苏金辉毛纺厂", user: "销售员小王", time: "昨天 15:30" },
  { id: "5", action: "报价更新", entity: "上海鼎信 - 年底针织面料订单", user: "销售员小李", time: "昨天 11:20" },
]

// Chart configurations
const revenueChartConfig = {
  revenue: { label: "营收", color: "var(--color-chart-1)" },
  target: { label: "目标", color: "var(--color-chart-2)" },
} satisfies ChartConfig

const stageChartConfig = {
  prospecting: { label: "初步接触", color: "var(--color-chart-1)" },
  qualification: { label: "需求确认", color: "var(--color-chart-2)" },
  proposal: { label: "方案报价", color: "var(--color-chart-3)" },
  negotiation: { label: "商务谈判", color: "var(--color-chart-4)" },
  closed: { label: "已成交", color: "var(--color-chart-5)" },
} satisfies ChartConfig

// Chart data
const revenueData = [
  { month: "1月", revenue: 185, target: 200 },
  { month: "2月", revenue: 220, target: 200 },
  { month: "3月", revenue: 280, target: 250 },
  { month: "4月", revenue: 310, target: 300 },
  { month: "5月", revenue: 275, target: 300 },
]

const stageDistribution = [
  { name: "初步接触", value: 12, fill: "var(--color-chart-1)" },
  { name: "需求确认", value: 8, fill: "var(--color-chart-2)" },
  { name: "方案报价", value: 5, fill: "var(--color-chart-3)" },
  { name: "商务谈判", value: 3, fill: "var(--color-chart-4)" },
  { name: "已成交", value: 7, fill: "var(--color-chart-5)" },
]

function Dashboard() {
  // Calculate stats
  const totalCustomers = customerMock.length
  const activeCustomers = customerMock.filter((c) => c.status === "active").length
  const totalOpportunities = opportunityMock.length
  const wonOpportunities = opportunityMock.filter((o) => o.stage === "closed-won").length
  const totalContracts = contractMock.length
  const activeContracts = contractMock.filter((c) => c.status === "in-progress" || c.status === "signed").length
  const totalRevenue = contractMock.filter((c) => c.status === "completed").reduce((sum, c) => sum + c.paidAmount, 0)
  const pendingRevenue = contractMock.filter((c) => c.status === "in-progress").reduce((sum, c) => sum + (c.amount - c.paidAmount), 0)

  // Recent contracts for table
  const recentContracts = contractMock.slice(0, 5)

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">仪表盘</h1>
        <p className="text-muted-foreground">欢迎回来，查看您的业务概览</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">客户总数</p>
                <p className="text-3xl font-bold">{totalCustomers}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">{activeCustomers}</span> 活跃客户
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">在跟商机</p>
                <p className="text-3xl font-bold">{totalOpportunities}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">{wonOpportunities}</span> 已成交
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">执行中合同</p>
                <p className="text-3xl font-bold">{activeContracts}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  共 <span className="font-medium">{totalContracts}</span> 份合同
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <FileText className="h-6 w-6 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">应收账款</p>
                <p className="text-3xl font-bold">¥{(pendingRevenue / 10000).toFixed(0)}万</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-amber-600 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" /> 待回款
                  </span>
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">业务概览</TabsTrigger>
          <TabsTrigger value="revenue">营收分析</TabsTrigger>
          <TabsTrigger value="pipeline">销售漏斗</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">月度营收趋势</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={revenueChartConfig} className="h-[280px] w-full">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="revenue" stroke="var(--color-chart-1)" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="target" stroke="var(--color-chart-2)" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">最近活动</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityData.map((activity, index) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="relative">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                        </div>
                        {index < activityData.length - 1 && (
                          <div className="absolute left-4 top-8 h-full w-px bg-border" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.entity}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{activity.user}</span>
                          <span>·</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">营收对比（单位：万元）</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={revenueChartConfig} className="h-[350px] w-full">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">商机阶段分布</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-[280px] w-full">
                  <PieChart>
                    <Pie
                      data={stageDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {stageDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {stageDistribution.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 text-sm">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
                      <span className="text-muted-foreground">{item.name}</span>
                      <span className="ml-auto font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Contracts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">最近合同</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentContracts.map((contract) => (
                    <div key={contract.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm font-medium">{contract.name}</p>
                        <p className="text-xs text-muted-foreground">{contract.customerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">¥{(contract.amount / 10000).toFixed(0)}万</p>
                        <Badge variant="outline" className={getBadgeClassName(
                          contract.status === "completed" ? "green" :
                          contract.status === "in-progress" ? "yellow" :
                          contract.status === "signed" ? "blue" : "gray"
                        )}>
                          {getDictLabel("dict-contract-status", contract.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
