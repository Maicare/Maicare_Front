"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { QrCode, UserIcon } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/common/hooks/use-auth"
import { TimeAgo } from "./_components/time-ago"

export default function EmployeeProfilePage() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const {user,changePassword,setup2FA,enable2FA} = useAuth({});
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [_, setSecret] = useState<string | null>(null);
  const handleSetup2FA = async () => {
    try {
      const data = await setup2FA({ displayProgress: true, displaySuccess: true });
      setQrCode(data.qr_code_base64);
      setSecret(data.secret);
    } catch (error) {
      console.error("2FA setup mislukt:", error);
    }
  };
  // Dummy medewerker data
  const employee = {
    name: (user?.first_name && user.last_name)  ? user.first_name + user.last_name : "Alex Johnson",
    email: user?.email || "alex.johnson@company.com",
    role:  "Senior Zorgcoördinator",
    department: "Cliëntdiensten",
    avatarUrl: "/avatars/employee-1.jpg",
    lastLogin: user?.last_login || "2 uur geleden",
    status: "actief",
  }

  const handlePasswordChange = async(e: React.FormEvent) => {
    e.preventDefault()
    // Behandel wachtwoordwijzigingslogica
    try {
      await changePassword(currentPassword, newPassword,confirmPassword,{ displayProgress: true, displaySuccess: true });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Wachtwoordwijziging mislukt:", error);
      // Behandel fout (bijv. toon notificatie)
    }
  }

  const handleTwoFactorToggle = async() => {
    setTwoFactorEnabled(!twoFactorEnabled);
    await handleSetup2FA();
  }

  const handleVerifyCode = async () => {
    try {
      await enable2FA(verificationCode, { displayProgress: true, displaySuccess: true });
      setVerificationCode("");
    } catch (error) {
      console.error("2FA verificatie mislukt:", error);
      // Behandel fout (bijv. toon notificatie)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
              <AvatarImage src={employee.avatarUrl} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl font-bold">
                {employee.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{employee.name}</h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  {employee.status}
                </Badge>
                <span className="text-sm text-gray-500">Laatste login: 
                  <TimeAgo timestamp={employee.lastLogin} />
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="font-medium text-gray-700">Snelle Statistieken</h3>
            <div className="flex gap-4 mt-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">42</div>
                <div className="text-xs text-gray-500">Cliënten</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">128</div>
                <div className="text-xs text-gray-500">Taken</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">98%</div>
                <div className="text-xs text-gray-500">Tevredenheid</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hoofdinhoud */}
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white">
            <TabsTrigger value="account" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600">
              Accountinstellingen
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-600">
              Beveiliging
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="mt-6">
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="bg-blue-100 p-2 rounded-full">
                    <UserIcon className="h-5 w-5 text-blue-600" />
                  </span>
                  Persoonlijke Informatie
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Volledige Naam</Label>
                    <Input id="name" value={employee.name} readOnly className="bg-gray-50" />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" value={employee.email} readOnly className="bg-gray-50" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role">Rol</Label>
                    <Input id="role" value={employee.role} readOnly className="bg-gray-50" />
                  </div>
                  <div>
                    <Label htmlFor="department">Afdeling</Label>
                    <Input id="department" value={employee.department} readOnly className="bg-gray-50" />
                  </div>
                </div>
                <div className="pt-4">
                  <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                    Profiel Bewerken
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6 space-y-6">
            {/* Wachtwoordwijziging Kaart */}
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="bg-purple-100 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </span>
                  Wachtwoord Wijzigen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Huidig Wachtwoord</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="border-gray-300 focus-visible:ring-purple-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">Nieuw Wachtwoord</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="border-gray-300 focus-visible:ring-purple-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Bevestig Nieuw Wachtwoord</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border-gray-300 focus-visible:ring-purple-500"
                    />
                  </div>
                  <div className="pt-2">
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                      Wachtwoord Bijwerken
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Twee-Factor Authenticatie Kaart */}
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="bg-green-100 p-2 rounded-full">
                    <QrCode className="h-5 w-5 text-green-600" />
                  </span>
                  Twee-Factor Authenticatie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium">Status</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {user?.two_factor_enabled || twoFactorEnabled  ? (
                        <span className="text-green-600">2FA is momenteel ingeschakeld</span>
                      ) : (
                        "Voeg een extra beveiligingslaag toe aan uw account"
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      id="two-factor"
                      checked={twoFactorEnabled}
                      onCheckedChange={handleTwoFactorToggle}
                      className="data-[state=checked]:bg-green-600"
                    />
                    <Label htmlFor="two-factor">
                      {twoFactorEnabled ? "Ingeschakeld" : "Uitgeschakeld"}
                    </Label>
                  </div>
                </div>

                {twoFactorEnabled && (
                  <div className="mt-6 space-y-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="bg-white p-3 rounded-md border">
                        {/* Tijdelijke plaats voor QR code - in een echte app zou dit gegenereerd worden */}
                        <div className="h-32 w-32 flex items-center justify-center bg-gray-100 text-gray-400">
                          {qrCode ? (
                            <img src={`data:image/png;base64,${qrCode}`} alt="2FA QR Code" className="h-32 w-32" />
                          ) : (
                            <span className="text-sm">QR Code</span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-green-800 mb-2">Stel authenticator app in</h4>
                        <ol className="list-decimal list-inside text-sm space-y-2 text-gray-700">
                          <li>Installeer een authenticator app zoals Google Authenticator of Authy</li>
                          <li>Scan de QR code met uw app</li>
                          <li>Voer de 6-cijferige code hieronder in om te verifiëren</li>
                        </ol>
                        <div className="mt-4">
                          <Label htmlFor="verificationCode">Verificatiecode</Label>
                          <Input
                            id="verificationCode"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="123456"
                            className="max-w-xs mt-1"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" className="border-green-300 text-green-600 hover:bg-green-50" onClick={handleVerifyCode}>
                        Code Verifiëren
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}