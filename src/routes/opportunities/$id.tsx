import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Target, TrendingUp, DollarSign, Calendar, Building2 } from "lucide-react"
import { opportunityMock } from "@/mock/opportunity"
import { customerMock } from "@/mock/customer"
import { getDictLabel, getBadgeClassName } from "@/lib/dict"
import type { Opportunity } from "@/types/opportunity"

export const Route = createFileRoute("/opportunities/$id")({
  component: OpportunityDetail,
})

// Stage order for progress display
const stageOrder = ["prospecting", "qualification", "proposal", "negotiation", "closed-won"]

function OpportunityDetail() {
  const { id } = Route.useParams()
  const opportunity = opportunityMock.find((o) => o.id === id)

  if (!opportunity) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">未找到该商机</p>
      </div>
    )
  }

  const customer = customerMock.find((c) => c.id === opportunity.customerId)
  const currentStageIndex = stageOrder.indexOf(opportunity.stage)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/opportunities"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{opportunity.name}</h1>
            <Badge variant="outline" className={getBadgeClassName(
              opportunity.stage === "closed-won" ? "green" :
              opportunity.stage === "closed-lost" ? "red" :
              opportunity.stage === "negotiation" ? "orange" :
              opportunity.stage === "proposal" ? "yellow" :
              opportunity.stage === "qualification" ? "blue" : "gray"
            )}>
              {getDictLabel("dict-opportunity-stage", opportunity.stage)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{opportunity.code}</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">商机概览</TabsTrigger>
          <TabsTrigger value="timeline">销售阶段</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">商机金额</p>
                    <p className="text-xl font-bold">¥{(opportunity.amount / 10000).toFixed(0)}万</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Target className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">赢单概率</p>
                    <p className="text-xl font-bold">{opportunity.probability}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">预计金额</p>
                    <p className="text-xl font-bold">¥{((opportunity.amount * opportunity.probability / 100) / 10000).toFixed(1)}万</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">预计成交</p>
                    <p className="text-xl font-bold">{opportunity.expectedCloseDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  客户信息
                </CardTitle>
              </CardHeader>
              <CardContent>
                {customer ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">客户名称</span>
                      <span className="font-medium">{customer.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">客户类型</span>
                      <Badge variant="outline" className={getBadgeClassName(
                        customer.type === "export" ? "purple" : "blue"
                      )}>
                        {getDictLabel("dict-customer-type", customer.type)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">联系人</span>
                      <span>{customer.contact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">联系电话</span>
                      <span>{customer.phone}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">未找到客户信息</p>
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">时间信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">创建时间</span>
                  <span>{opportunity.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">更新时间</span>
                  <span>{opportunity.updatedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">预计成交</span>
                  <span className="font-medium text-amber-600">{opportunity.expectedCloseDate}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">销售漏斗</CardTitle>
              <CardDescription>商机当前阶段：{getDictLabel("dict-opportunity-stage", opportunity.stage)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Progress bar */}
                <div className="relative">
                  <Progress value={(currentStageIndex / (stageOrder.length - 1)) * 100} className="h-3" />
                </div>

                {/* Stage steps */}
                <div className="grid grid-cols-5 gap-2">
                  {stageOrder.map((stage, index) => {
                    const isActive = stage === opportunity.stage
                    const isCompleted = index < currentStageIndex
                    const isLost = opportunity.stage === "closed-lost"

                    return (
                      <div key={stage} className="text-center">
                        <div className={cn(
                          "w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center",
                          isActive ? "bg-primary text-primary-foreground" :
                          isCompleted ? "bg-green-100 dark:bg-green-900/30 text-green-600" :
                          "bg-muted text-muted-foreground"
                        )}>
                          {isCompleted ? "✓" : index + 1}
                        </div>
                        <p className={cn(
                          "text-xs font-medium",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}>
                          {getDictLabel("dict-opportunity-stage", stage)}
                        </p>
                      </div>
                    )
                  })}
                </div>

                {opportunity.stage === "closed-lost" && (
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400 text-center">
                      该商机已失败，可在商机列表中查看详情
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Import cn utility
import { cn } from "@/lib/utils"
