import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Building2, MapPin, Phone, Mail, CreditCard, Calendar } from "lucide-react"
import { customerMock } from "@/mock/customer"
import { contractMock } from "@/mock/contract"
import { opportunityMock } from "@/mock/opportunity"
import { getDictLabel, getBadgeClassName } from "@/lib/dict"
import type { Customer } from "@/types/customer"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/customers/$id")({
  component: CustomerDetail,
})

function CustomerDetail() {
  const { id } = Route.useParams()
  const customer = customerMock.find((c) => c.id === id)

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">未找到该客户</p>
      </div>
    )
  }

  // Get related contracts and opportunities
  const customerContracts = contractMock.filter((c) => c.customerId === customer.id)
  const customerOpportunities = opportunityMock.filter((o) => o.customerId === customer.id)

  // Calculate total stats
  const totalContractAmount = customerContracts.reduce((sum, c) => sum + c.amount, 0)
  const totalPaidAmount = customerContracts.reduce((sum, c) => sum + c.paidAmount, 0)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/customers"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{customer.name}</h1>
            <Badge variant="outline" className={getBadgeClassName(
              customer.status === "active" ? "green" :
              customer.status === "potential" ? "blue" : "gray"
            )}>
              {getDictLabel("dict-customer-status", customer.status)}
            </Badge>
            <Badge variant="outline" className={getBadgeClassName(
              customer.type === "export" ? "purple" : "blue"
            )}>
              {getDictLabel("dict-customer-type", customer.type)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{customer.code}</p>
        </div>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">基本信息</TabsTrigger>
          <TabsTrigger value="contracts">合同记录</TabsTrigger>
          <TabsTrigger value="opportunities">商机跟进</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Basic Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  联系信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
                  <span className="text-muted-foreground">联系人</span>
                  <span className="font-medium">{customer.contact}</span>

                  <span className="text-muted-foreground">联系电话</span>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{customer.phone}</span>
                  </div>

                  <span className="text-muted-foreground">电子邮箱</span>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{customer.email}</span>
                  </div>

                  <span className="text-muted-foreground">公司地址</span>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                    <span>{customer.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credit Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  信用与账期
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">信用额度</p>
                    <p className="text-2xl font-bold">¥{(customer.creditLimit / 10000).toFixed(0)}万</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">账期天数</p>
                    <p className="text-2xl font-bold">{customer.paymentDays}天</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  时间线
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">创建时间</span>
                    <span className="font-medium">{customer.createdAt}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">更新时间</span>
                    <span className="font-medium">{customer.updatedAt}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">合同总数</p>
                <p className="text-3xl font-bold">{customerContracts.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">合同总额</p>
                <p className="text-3xl font-bold">¥{(totalContractAmount / 10000).toFixed(0)}万</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">已回款</p>
                <p className="text-3xl font-bold text-green-600">¥{(totalPaidAmount / 10000).toFixed(0)}万</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">合同列表</CardTitle>
            </CardHeader>
            <CardContent>
              {customerContracts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">暂无合同记录</p>
              ) : (
                <div className="space-y-3">
                  {customerContracts.map((contract) => (
                    <div key={contract.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <p className="font-medium">{contract.name}</p>
                        <p className="text-sm text-muted-foreground">{contract.code}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">¥{(contract.amount / 10000).toFixed(0)}万</p>
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">商机列表</CardTitle>
            </CardHeader>
            <CardContent>
              {customerOpportunities.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">暂无商机记录</p>
              ) : (
                <div className="space-y-3">
                  {customerOpportunities.map((opp) => (
                    <div key={opp.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <p className="font-medium">{opp.name}</p>
                        <p className="text-sm text-muted-foreground">{opp.code}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-medium">¥{(opp.amount / 10000).toFixed(0)}万</p>
                        <Badge variant="outline" className={getBadgeClassName(
                          opp.stage === "closed-won" ? "green" :
                          opp.stage === "closed-lost" ? "red" :
                          opp.stage === "negotiation" ? "orange" :
                          opp.stage === "proposal" ? "yellow" :
                          opp.stage === "qualification" ? "blue" : "gray"
                        )}>
                          {getDictLabel("dict-opportunity-stage", opp.stage)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
