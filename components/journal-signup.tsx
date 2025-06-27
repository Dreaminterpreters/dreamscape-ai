"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, User, Lock, Eye, EyeOff } from "lucide-react"

export default function JournalSignup() {
  const [activeTab, setActiveTab] = useState("signup")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)

  // Sign up form
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
  })

  // Sign in form
  const [signinForm, setSigninForm] = useState({
    email: "",
    password: "",
  })

  const handleSignup = async () => {
    if (!signupForm.name.trim() || !signupForm.email.trim() || !signupForm.password) {
      return
    }

    setLoading(true)

    // Simulate API call for preview
    setTimeout(() => {
      setSuccess(true)
      setLoading(false)
    }, 1500)
  }

  const handleSignin = async () => {
    if (!signinForm.email.trim() || !signinForm.password) {
      return
    }

    setLoading(true)

    // Simulate API call for preview
    setTimeout(() => {
      setSuccess(true)
      setLoading(false)
    }, 1500)
  }

  if (success) {
    return (
      <Card className="max-w-2xl mx-auto bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-green-800 mb-2">Welcome to Your Dream Journal!</h3>
          <p className="text-green-700 mb-4">
            {activeTab === "signup"
              ? "Your account has been created successfully. Start recording your dreams today!"
              : "Welcome back! Your dream journal is ready for new entries."}
          </p>
          <Button className="bg-green-600 hover:bg-green-700">
            <BookOpen className="w-4 h-4 mr-2" />
            Open My Dream Journal
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-purple-600" />
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Your Free Dream Journal
        </CardTitle>
        <CardDescription className="text-lg text-gray-600">
          Track your dreams, discover patterns, and deepen your understanding
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signup" className="text-lg py-3">
              <User className="w-4 h-4 mr-2" />
              Sign Up
            </TabsTrigger>
            <TabsTrigger value="signin" className="text-lg py-3">
              <Lock className="w-4 h-4 mr-2" />
              Sign In
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signup" className="space-y-4">
            <div>
              <Label htmlFor="signup-name">Full Name</Label>
              <Input
                id="signup-name"
                value={signupForm.name}
                onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                placeholder="Enter your full name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="signup-email">Email Address</Label>
              <Input
                id="signup-email"
                type="email"
                value={signupForm.email}
                onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                placeholder="Enter your email"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                  placeholder="Create a password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <Button
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-3"
            >
              {loading ? "Creating Account..." : "Create Free Account"}
            </Button>
          </TabsContent>

          <TabsContent value="signin" className="space-y-4">
            <div>
              <Label htmlFor="signin-email">Email Address</Label>
              <Input
                id="signin-email"
                type="email"
                value={signinForm.email}
                onChange={(e) => setSigninForm({ ...signinForm, email: e.target.value })}
                placeholder="Enter your email"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="signin-password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  value={signinForm.password}
                  onChange={(e) => setSigninForm({ ...signinForm, password: e.target.value })}
                  placeholder="Enter your password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="text-right">
              <Button variant="link" className="text-purple-600 hover:text-purple-700 p-0">
                Forgot password?
              </Button>
            </div>

            <Button
              onClick={handleSignin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-3"
            >
              {loading ? "Signing In..." : "Sign In to Journal"}
            </Button>
          </TabsContent>
        </Tabs>

        {/* Features */}
        <div className="mt-8 grid md:grid-cols-3 gap-4 text-center">
          <div className="p-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-800">Track Dreams</h4>
            <p className="text-sm text-gray-600">Record and organize all your dreams</p>
          </div>
          <div className="p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">📊</span>
            </div>
            <h4 className="font-semibold text-gray-800">Find Patterns</h4>
            <p className="text-sm text-gray-600">Discover recurring themes and symbols</p>
          </div>
          <div className="p-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">🔒</span>
            </div>
            <h4 className="font-semibold text-gray-800">Stay Private</h4>
            <p className="text-sm text-gray-600">Your dreams remain completely private</p>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>✓ 100% Free Forever ✓ No Spam ✓ Unsubscribe Anytime ✓ Your Dreams Stay Private</p>
        </div>
      </CardContent>
    </Card>
  )
}
