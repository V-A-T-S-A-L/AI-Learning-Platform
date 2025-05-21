"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Code, Cpu, Github, Globe, Menu, MessageSquare, Twitter, X } from "lucide-react"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dotted-dialog"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { CloudPlatform } from "./interactive/cloud-platform"
import { AnalyticsPlatform } from "./interactive/analytics-platform"
import { SecurityPlatform } from "./interactive/security-platform"
import { TeamVisualization } from "./interactive/team-visualization"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const isVerySmall = useMediaQuery("(max-width: 500px)")

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const headerClass =
    scrollY > 50 ? "py-4 bg-black/80 backdrop-blur-md border-b border-gray-800/50" : "py-6 bg-transparent"

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerClass}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <Cpu className="h-6 w-6 text-purple-500" />
            <span className="font-bold text-xl">TechNova</span>
          </motion.div>
          <nav className="hidden md:flex items-center gap-8">
            {["Features", "Products", "About", "Testimonials"].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              >
                <Link
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </nav>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Button
              variant="outline"
              className="hidden md:flex border-purple-500 text-purple-500 hover:bg-purple-950"
              onClick={() => setIsModalOpen(true)}
            >
              Get Started
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-black border-b border-gray-800 md:hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-6">
              {["Features", "Products", "About", "Testimonials"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-white transition-colors text-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <Button
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full"
                onClick={() => {
                  setIsMenuOpen(false)
                  setIsModalOpen(true)
                }}
              >
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black" />
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-purple-900/10 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,50,255,0.1),transparent_65%)]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight"
            >
              The Future of Studying is Here
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
            >
              Discover cutting-edge solutions that transform the way you interact with technology. Powerful, intuitive,
              and designed for the future.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 sm:px-8 py-4 sm:py-6 rounded-full text-sm sm:text-lg font-medium shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 transition-all duration-300"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="relative w-full max-w-5xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg blur-3xl" />
            <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-lg overflow-hidden shadow-2xl">
              <div className="relative h-[300px] md:h-[500px] w-full bg-gray-950 p-4 overflow-hidden">
                {/* Dashboard Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-300">System Status: Online</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-gray-800 hover:bg-gray-700 p-1 rounded">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Dashboard Tabs */}
                <div className="flex border-b border-gray-800 mb-4">
                  <button className="px-4 py-2 text-sm font-medium text-purple-400 border-b-2 border-purple-500">
                    Overview
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-300">Analytics</button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-300">Reports</button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-300">Settings</button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {[
                    { label: "Total Users", value: "24,521", change: "+12%", color: "text-green-500" },
                    { label: "Revenue", value: "$42,500", change: "+8%", color: "text-green-500" },
                    { label: "Active Sessions", value: "1,293", change: "-3%", color: "text-red-500" },
                    { label: "Conversion Rate", value: "12.3%", change: "+2%", color: "text-green-500" },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="bg-gray-900 p-3 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
                    >
                      <div className="text-xs text-gray-400">{stat.label}</div>
                      <div className="text-lg font-bold">{stat.value}</div>
                      <div className={`text-xs ${stat.color} flex items-center gap-1`}>
                        {stat.change}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d={
                              stat.change.startsWith("+")
                                ? "M12 19V5M12 5L5 12M12 5L19 12"
                                : "M12 5V19M12 19L19 12M12 19L5 12"
                            }
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 mb-4 h-[120px] md:h-[180px] relative">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium">Revenue Overview</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                        <span className="text-xs text-gray-400">This Month</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <span className="text-xs text-gray-400">Last Month</span>
                      </div>
                    </div>

                    {/* Interactive Chart */}
                    <div className="h-[80px] md:h-[120px] flex items-end">
                      {[35, 45, 30, 60, 75, 45, 55, 70, 60, 75, 85, 65].map((height, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center group">
                          <div className="relative w-full">
                            <div
                              className="w-full bg-purple-500/20 hover:bg-purple-500/30 transition-colors rounded-sm cursor-pointer"
                              style={{ height: `${height}%` }}
                            >
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                ${Math.floor(height * 120)}: {index + 1} Jan
                              </div>
                            </div>
                          </div>
                          <div className="text-[8px] text-gray-500 mt-1">{index + 1}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Table */}
                  <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                    <div className="p-3 border-b border-gray-800 flex justify-between items-center">
                      <h3 className="text-sm font-medium">Recent Transactions</h3>
                      <button className="text-xs text-purple-400 hover:text-purple-300">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-950">
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">ID</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Customer</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Amount</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Status</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                          {[
                            {
                              id: "#TRX-5632",
                              customer: "John Smith",
                              amount: "$125.00",
                              status: "Completed",
                              date: "Today, 2:30 PM",
                            },
                            {
                              id: "#TRX-5631",
                              customer: "Alice Johnson",
                              amount: "$250.00",
                              status: "Pending",
                              date: "Today, 11:15 AM",
                            },
                            {
                              id: "#TRX-5630",
                              customer: "Robert Brown",
                              amount: "$350.00",
                              status: "Completed",
                              date: "Yesterday, 3:45 PM",
                            },
                          ].map((transaction, index) => (
                            <tr key={index} className="hover:bg-gray-800/50 cursor-pointer">
                              <td className="px-4 py-2 text-xs">{transaction.id}</td>
                              <td className="px-4 py-2 text-xs">{transaction.customer}</td>
                              <td className="px-4 py-2 text-xs">{transaction.amount}</td>
                              <td className="px-4 py-2 text-xs">
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    transaction.status === "Completed"
                                      ? "bg-green-900/30 text-green-400"
                                      : "bg-yellow-900/30 text-yellow-400"
                                  }`}
                                >
                                  {transaction.status}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-xs text-gray-400">{transaction.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(120,50,255,0.15),transparent_50%)]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Powerful Features</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Our platform offers a comprehensive suite of tools designed to enhance your productivity and streamline
                your workflow.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Code className="h-10 w-10 text-purple-500" />,
                title: "Advanced API",
                description:
                  "Integrate seamlessly with our robust API designed for developers with comprehensive documentation and examples.",
              },
              {
                icon: <Globe className="h-10 w-10 text-blue-500" />,
                title: "Global CDN",
                description:
                  "Lightning-fast content delivery across our worldwide network with 99.9% uptime guarantee.",
              },
              {
                icon: <CheckCircle className="h-10 w-10 text-green-500" />,
                title: "Reliable Security",
                description:
                  "Enterprise-grade security with end-to-end encryption and compliance with industry standards.",
              },
              {
                icon: <Cpu className="h-10 w-10 text-red-500" />,
                title: "AI-Powered",
                description:
                  "Leverage the power of artificial intelligence to optimize your workflow and gain valuable insights.",
              },
              {
                icon: <MessageSquare className="h-10 w-10 text-yellow-500" />,
                title: "24/7 Support",
                description:
                  "Our dedicated team is always available to assist you with any issues through multiple channels.",
              },
              {
                icon: <Github className="h-10 w-10 text-gray-400" />,
                title: "Open Source",
                description:
                  "Contribute to our growing ecosystem of open-source tools and libraries with active community support.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="h-full bg-gradient-to-b from-gray-900 to-gray-950 p-[1px] rounded-xl">
                  <div className="h-full bg-gradient-to-b from-gray-900 to-gray-950 p-6 rounded-xl border border-gray-800/50 hover:border-purple-500/50 transition-colors backdrop-blur-sm">
                    <div className="mb-4 p-3 bg-gray-800/30 rounded-lg inline-block">{feature.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(120,50,255,0.15),transparent_50%)]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Products</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Explore our suite of innovative products designed to transform your digital experience.
              </p>
            </motion.div>
          </div>

          <div className="space-y-24">
            {/* TechNova Cloud */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <h3 className="text-3xl font-bold">TechNova Cloud</h3>
                <p className="text-gray-300 text-lg">
                  A scalable cloud platform that adapts to your needs. Deploy applications with ease and manage
                  resources efficiently.
                </p>
                <ul className="space-y-3">
                  {["Auto-scaling", "Global distribution", "Pay-as-you-go pricing", "99.9% uptime SLA"].map(
                    (feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-purple-500" />
                        <span>{feature}</span>
                      </li>
                    ),
                  )}
                </ul>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Learn More
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-1 rounded-lg">
                  <div className="relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden">
                    <CloudPlatform />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* TechNova Analytics */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="order-1 md:order-last space-y-4 md:space-y-6"
              >
                <h3 className="text-2xl md:text-3xl font-bold">TechNova Analytics</h3>
                <p className="text-gray-300 text-base md:text-lg">
                  Gain valuable insights from your data with our powerful analytics platform. Make data-driven decisions
                  with confidence.
                </p>
                <ul className="space-y-2 md:space-y-3">
                  {["Real-time dashboards", "Custom reports", "AI-powered predictions", "Data visualization"].map(
                    (feature, i) => (
                      <li key={i} className="flex items-center gap-2 md:gap-3">
                        <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-purple-500 flex-shrink-0" />
                        <span className="text-sm md:text-base">{feature}</span>
                      </li>
                    ),
                  )}
                </ul>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Learn More
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="order-2 md:order-first"
              >
                <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-1 rounded-lg">
                  <div className="relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden">
                    <AnalyticsPlatform />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* TechNova Security */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-4 md:space-y-6 order-1 md:order-1"
              >
                <h3 className="text-2xl md:text-3xl font-bold">TechNova Security</h3>
                <p className="text-gray-300 text-base md:text-lg">
                  Protect your digital assets with our comprehensive security solution. Stay ahead of threats with
                  advanced protection.
                </p>
                <ul className="space-y-2 md:space-y-3">
                  {[
                    "Threat detection",
                    "Vulnerability scanning",
                    "Compliance monitoring",
                    "24/7 security operations",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 md:gap-3">
                      <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-purple-500 flex-shrink-0" />
                      <span className="text-sm md:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Learn More
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="order-2 md:order-2"
              >
                <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-1 rounded-lg">
                  <div className="relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden">
                    <SecurityPlatform />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,50,255,0.15),transparent_60%)]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 md:order-1"
            >
              <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-4 md:mb-6">About Our Mission</h2>
              <p className="text-gray-300 mb-4 md:mb-6 text-sm sm:text-base md:text-lg">
                Founded in 2023, TechNova was created with a singular vision: to democratize access to cutting-edge
                technology. We believe that powerful tools should be accessible to everyone, regardless of technical
                expertise.
              </p>
              <p className="text-gray-300 mb-4 md:mb-6 text-sm sm:text-base md:text-lg">
                Our team of passionate engineers and designers work tirelessly to create intuitive, powerful solutions
                that solve real-world problems and empower our users to achieve more.
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="bg-gray-800/50 backdrop-blur-sm px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm md:text-base">
                  <span className="text-purple-400 font-medium">50+</span> Team Members
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm md:text-base">
                  <span className="text-purple-400 font-medium">10k+</span> Customers
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm md:text-base">
                  <span className="text-purple-400 font-medium">99.9%</span> Uptime
                </div>
              </div>
              <Button
                variant="outline"
                className="border-purple-500 text-purple-500 hover:bg-purple-950 text-sm sm:text-base"
              >
                Learn More About Us
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-2 md:order-2"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg blur-xl" />
                <div className="relative rounded-lg overflow-hidden">
                  <div className="w-full h-[300px] md:h-[400px]">
                    <TeamVisualization />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(120,50,255,0.15),transparent_50%)]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">What Our Clients Say</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Don't just take our word for it. Here's what our clients have to say about their experience with
                TechNova.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "CTO, TechStart Inc.",
                image: "https://avatar.vercel.sh/jill",
                content:
                  "TechNova has completely transformed our development workflow. The platform's intuitive design and powerful features have increased our team's productivity by over 40%.",
              },
              {
                name: "Michael Chen",
                role: "Founder, DataFlow",
                image: "https://avatar.vercel.sh/jill",
                content:
                  "Implementing TechNova was one of the best decisions we've made. The seamless integration and robust API have allowed us to focus on what matters most - building great products.",
              },
              {
                name: "Emily Rodriguez",
                role: "Lead Developer, InnovateCorp",
                image: "https://avatar.vercel.sh/jill",
                content:
                  "As a developer, I appreciate the attention to detail in TechNova's platform. The documentation is comprehensive, and the support team is always ready to help.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="h-full bg-gradient-to-b from-gray-900 to-gray-950 p-[1px] rounded-xl">
                  <div className="h-full bg-gradient-to-b from-gray-900 to-gray-950 p-8 rounded-xl border border-gray-800/50 backdrop-blur-sm">
                    <div className="flex items-center mb-6">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                        
                      </div>
                      <div>
                        <h4 className="font-bold">{testimonial.name}</h4>
                        <p className="text-gray-400 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 italic">"{testimonial.content}"</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(120,50,255,0.15),transparent_50%)]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-gray-300 mb-8 text-lg">
                Join thousands of satisfied users who have already transformed their workflow with TechNova.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-gradient-to-b from-gray-900 to-gray-950 p-[1px] rounded-xl">
                <div className="bg-gradient-to-b from-gray-900 to-gray-950 p-8 rounded-xl border border-gray-800/50 backdrop-blur-sm">
                  <h3 className="text-2xl font-bold mb-6">Contact Us</h3>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-300">
                          Name
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your name"
                          className="bg-gray-800/50 border-gray-700 focus:border-purple-500 h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-300">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          className="bg-gray-800/50 border-gray-700 focus:border-purple-500 h-12"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-gray-300">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="Enter subject"
                        className="bg-gray-800/50 border-gray-700 focus:border-purple-500 h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-300">
                        Message
                      </Label>
                      <textarea
                        id="message"
                        rows={4}
                        placeholder="Enter your message"
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      ></textarea>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12 text-base">
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-gray-800/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(120,50,255,0.1),transparent_70%)]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Cpu className="h-6 w-6 text-purple-500" />
                <span className="font-bold text-xl">TechNova</span>
              </div>
              <p className="text-gray-400 mb-6">
                Empowering innovation through technology. We build tools that help businesses thrive in the digital age.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Products</h4>
              <ul className="space-y-4">
                {["Cloud Platform", "Analytics", "Security", "API", "Documentation"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Company</h4>
              <ul className="space-y-4">
                {["About", "Careers", "Blog", "Press", "Partners"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Legal</h4>
              <ul className="space-y-4">
                {["Terms", "Privacy", "Cookies", "Licenses", "Contact"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} TechNova. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && setIsModalOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Get Early Access</DialogTitle>
            <DialogDescription>
              Join our exclusive beta program and be among the first to experience the future of technology.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="modal-email">Email</Label>
              <Input
                id="modal-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800/50 border-gray-700 focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-name">Full Name</Label>
              <Input
                id="modal-name"
                type="text"
                placeholder="Enter your full name"
                className="bg-gray-800/50 border-gray-700 focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-company">Company (Optional)</Label>
              <Input
                id="modal-company"
                type="text"
                placeholder="Enter your company name"
                className="bg-gray-800/50 border-gray-700 focus:border-purple-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={() => {
                alert("Thank you for your interest! We'll be in touch soon.")
                setIsModalOpen(false)
              }}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
