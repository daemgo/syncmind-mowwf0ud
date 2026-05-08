import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  FileText,
  Building2,
  DollarSign,
  Calendar,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react"
import { contractMock } from "@/mock/contract"
import { customerMock } from "@/mock/customer"
import { getDictLabel, getBadgeClassName } from "@/lib/dict"
import type { Contract } from "@/types/contract"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/contracts/$id")({
  component: ContractDetail,
})

function ContractDetail() {
  const { id } = Route.useParams()
  const contract = contractMock.find((c) => c.id === id)

  if (!contract) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">未找到该合同</p>
      </div>
    )
  }

  const customer = customerMock.find((c) => c.id === contract.customerId)
  const pendingAmount = contract.amount - contract.paidAmount
  const paymentProgress = (contract.paidAmount / contract.amount) * 100

  // Status flow for visualization
  const statusFlow = ["draft", "signed", "in-progress", "completed"]
  const statusIcons: Record<string, React.ReactNode> = {
    draft: <FileText className="h-4 w-4" />,
    signed: <FileText className="h-4 w-4" />,
    "in-progress": <Truck className="h-4 w-4" />,
    completed: <CheckCircle2 className="h-4 w-4" />,
  }
  const statusLabels: Record<string, string> = {
    draft: "草稿",
    signed: "已签约",
    "in-progress": "执行中",
    completed: "已完成",
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/contracts"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{contract.name}</h1>
            <Badge variant="outline" className={getBadgeClassName(
              contract.status === "completed" ? "green" :
              contract.status === "in-progress" ? "yellow" :
              contract.status === "signed" ? "blue" :
              contract.status === "cancelled" ? "red" : "gray"
            )}>
              {getDictLabel("dict-contract-status", contract.status)}
            </Badge>
            <Badge variant="outline" className={getBadgeClassName(
              contract.type === "export" ? "purple" :
              contract.type === "import" ? "orange" : "blue"
            )}>
              {getDictLabel("dict-contract-type", contract.type)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{contract.code}</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">合同概览</TabsTrigger>
          <TabsTrigger value="payment">回款进度</TabsTrigger>
          <TabsTrigger value="timeline">合同阶段</TabsTrigger>
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
                    <p className="text-sm text-muted-foreground">合同金额</p>
                    <p className="text-xl font-bold">¥{(contract.amount / 10000).toFixed(0)}万</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">已回款</p>
                    <p className="text-xl font-bold text-green-600">¥{(contract.paidAmount / 10000).toFixed(0)}万</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">待回款</p>
                    <p className="text-xl font-bold text-amber-600">¥{(pendingAmount / 10000).toFixed(0)}万</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">交付日期</p>
                    <p className="text-xl font-bold">{contract.deliveryDate}</p>
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
                      <span className="text-muted-foreground">联系人</span>
                      <span>{customer.contact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">联系电话</span>
                      <span>{customer.phone}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">信用额度</span>
                      <span>¥{(customer.creditLimit / 10000).toFixed(0)}万</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">账期</span>
                      <span>{customer.paymentDays}天</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">未找到客户信息</p>
                )}
              </CardContent>
            </Card>

            {/* Contract Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  合同信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">合同类型</span>
                  <Badge variant="outline" className={getBadgeClassName(
                    contract.type === "export" ? "purple" :
                    contract.type === "import" ? "orange" : "blue"
                  )}>
                    {getDictLabel("dict-contract-type", contract.type)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">签约日期</span>
                  <span>{contract.signedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">交付日期</span>
                  <span>{contract.deliveryDate}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">创建时间</span>
                  <span>{contract.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">更新时间</span>
                  <span>{contract.updatedAt}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">回款进度</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">已回款 / 合同总额</span>
                <span className="font-medium">
                  ¥{(contract.paidAmount / 10000).toFixed(1)}万 / ¥{(contract.amount / 10000).toFixed(1)}万
                </span>
              </div>
              <Progress value={paymentProgress} className="h-3" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">回款进度</span>
                <span className="font-medium">{paymentProgress.toFixed(1)}%</span>
              </div>

              {pendingAmount > 0 && (
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      待回款金额：¥{(pendingAmount / 10000).toFixed(1)}万
                    </p>
                  </div>
                </div>
              )}

              {contract.status === "completed" && (
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <p className="text-sm text-green-600 dark:text-green-400">
                      该合同已全部回款
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">合同阶段</CardTitle>
              <CardDescription>当前状态：{statusLabels[contract.status] || contract.status}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="relative">
                  <Progress
                    value={
                      contract.status === "cancelled" ? 0 :
                      (statusFlow.indexOf(contract.status) / (statusFlow.length - 1)) * 100
                    }
                    className="h-3"
                  />
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {statusFlow.map((status, index) => {
                    const isActive = status === contract.status
                    const isCompleted = statusFlow.indexOf(contract.status) > index
                    const isCancelled = contract.status === "cancelled"

                    return (
                      <div key={status} className="text-center">
                        <div className={cn(
                          "w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center",
                          isActive ? "bg-primary text-primary-foreground" :
                          isCompleted ? "bg-green-100 dark:bg-green-900/30 text-green-600" :
                          isCancelled ? "bg-red-100 dark:bg-red-900/30 text-red-600" :
                          "bg-muted text-muted-foreground"
                        )}>
                          {statusIcons[status]}
                        </div>
                        <p className={cn(
                          "text-xs font-medium",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}>
                          {statusLabels[status]}
                        </p>
                      </div>
                    )
                  })}
                </div>

                {contract.status === "cancelled" && (
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400 text-center">
                      该合同已取消
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
