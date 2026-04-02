"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "SEO", href: "#seo" },
  { name: "Projects", href: "#projects" },  
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    const handleScroll = () => {
      // Determines if the scroll position is past 20px
      setScrolled(window.scrollY > 20)

      // Determine active section based on scroll position
      const sections = navItems.map(item => item.href.substring(1))
      
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Call once to set initial active section
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle smooth scrolling for anchor links
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.substring(1)
    const targetElement = document.getElementById(targetId)
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
      // Close mobile menu if open
      setIsOpen(false)
      // Update URL without jumping
      window.history.pushState(null, "", href)
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "py-3 glass" : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link 
          href="#home" 
          className="text-2xl font-heading font-bold text-gradient"
          onClick={(e) => handleSmoothScroll(e, "#home")}
        >
          Waqas.
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <a
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className={`text-sm font-medium relative group transition-colors ${
                  activeSection === item.href.substring(1) 
                    ? "text-primary" 
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.name}
                <span
                  className={`absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 ${
                    activeSection === item.href.substring(1) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </a>
            </motion.div>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white z-50 relative" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass absolute top-full left-0 w-full"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <a
                    href={item.href}
                    onClick={(e) => handleSmoothScroll(e, item.href)}
                    className={`block py-2 text-lg font-medium transition-colors ${
                      activeSection === item.href.substring(1)
                        ? "text-primary"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
