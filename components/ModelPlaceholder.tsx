'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { memo, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Sparkles, ArrowRight, X, Ruler, User, Loader2, CheckCircle2 } from 'lucide-react'
import { submitOrder } from '@/lib/orderService'

const LightRays = dynamic(() => import('./LightRays'), {
  ssr: false,
  loading: () => null
})

function ModelPlaceholder() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [nameValue, setNameValue] = useState('')
  const [yearValue, setYearValue] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [customSize, setCustomSize] = useState('')
  const [showCustomSizeInput, setShowCustomSizeInput] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [transactionId, setTransactionId] = useState('')
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [mousePosition, setMousePosition] = useState<{ [key: string]: { x: number; y: number } }>({})

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, productId: string) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePosition(prev => ({ ...prev, [productId]: { x, y } }))
  }

  const scrollToOrder = () => {
    const orderSection = document.getElementById('order-section')
    orderSection?.scrollIntoView({ behavior: 'smooth' })
  }

  const openModal = (product: any) => {
    setSelectedProduct(product)
    setNameValue('')
    setYearValue('')
    setSelectedSize('')
    setCustomSize('')
    setShowCustomSizeInput(false)
  }

  const closeModal = () => {
    setSelectedProduct(null)
  }

  const handleGrabYours = () => {
    const finalSize = selectedSize === 'Other' ? customSize : selectedSize
    setOrderDetails({
      product: selectedProduct,
      name: nameValue,
      year: yearValue,
      size: finalSize
    })
    setSelectedProduct(null) // Close product modal
    setShowPaymentModal(true) // Open payment modal
  }

  const closePaymentModal = () => {
    setShowPaymentModal(false)
    setTransactionId('')
    setSubmitError(null)
    setOrderSuccess(false)
  }

  const handleConfirmOrder = async () => {
    if (!transactionId || !orderDetails) return
    
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const result = await submitOrder({
        name: orderDetails.name,
        year: orderDetails.year,
        size: orderDetails.size,
        transactionId: transactionId,
        merchType: orderDetails.product.id, // 'tshirt' or 'jacket'
      })

      if (result.success) {
        setOrderSuccess(true)
        
        // Show success for 2 seconds then close
        setTimeout(() => {
          closePaymentModal()
          setOrderSuccess(false)
          // Reset all form states
          setNameValue('')
          setYearValue('')
          setSelectedSize('')
          setCustomSize('')
          setShowCustomSizeInput(false)
          setOrderDetails(null)
        }, 2000)
      } else {
        setSubmitError(result.error || 'Failed to submit order. Please try again.')
      }
    } catch (error) {
      console.error('Order submission error:', error)
      setSubmitError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const SIZES = [
    { size: 'S', measurement: '36' },
    { size: 'M', measurement: '38' },
    { size: 'L', measurement: '40' },
    { size: 'XL', measurement: '42' },
    { size: 'XXL', measurement: '44' },
  ]

  const products = [
    {
      id: 'tshirt',
      title: 'Premium T-Shirt',
      subtitle: 'Classic Comfort',
      description: 'Limited edition merchandise',
      price: '₹529',
      image: 'https://res.cloudinary.com/dwwihknne/image/upload/v1769709464/swayam_gsdk16.png',
      detailedDescription: 'Engineered for robotics enthusiasts who demand excellence. This premium polo combines cutting-edge fabric technology with iconic IRC design elements. Features moisture-wicking material, breathable construction, and a custom name print on the back.',
      features: ['Premium Cotton Blend', 'Moisture Wicking', 'Custom Name Print', 'Durable Construction', 'Limited Edition Design'],
    },
    {
      id: 'jacket',
      title: 'Sport Jacket',
      subtitle: 'Elite Performance',
      description: 'Premium quality design',
      price: '₹899',
      image: 'https://res.cloudinary.com/dwwihknne/image/upload/v1769766463/swayam_2_dy37ud.png',
      detailedDescription: 'Ultimate performance wear designed for the robotics arena. Built with sporty and comfortable fabric that adapts to your movement, this hoodie represents the pinnacle of IRC merchandise craftsmanship. Premium finishing with personalized name customization.',
      features: ['Sporty Fabric', 'Advanced Breathability', 'Premium Design', 'Custom Name Print', 'Elite Edition'],
    },
  ]

  return (
    <section
      id="model-section"
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20"
      style={{ 
        backgroundColor: '#000000',
      }}
    >
      {/* Light Rays - Center stage dramatic effect */}
      <div className="absolute inset-0" style={{ zIndex: 8, pointerEvents: 'none', opacity: 0.6 }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#66D9FF"
          raysSpeed={0.5}
          lightSpread={0.8}
          rayLength={2.5}
          followMouse={false}
          mouseInfluence={0}
          noiseAmount={0.1}
          distortion={0.05}
          pulsating={false}
          fadeDistance={0.9}
          saturation={0.85}
        />
      </div>

      {/* Content container */}
      <div className="relative w-full max-w-7xl mx-auto px-6" style={{ zIndex: 10 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 border border-cyan-500/30 rounded-full bg-cyan-500/5 backdrop-blur-xl"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-sm font-mono text-cyan-400 tracking-wider uppercase">
              Choose Your Style
            </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-5xl md:text-7xl font-black mb-4 tracking-tight"
          >
            <span className="bg-gradient-to-br from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
              IRC Collection
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Premium quality merchandise designed for the robotics community
          </motion.p>
        </motion.div>

        {/* Product Cards */}
        <div className="grid md:grid-cols-2 gap-10 max-w-7xl mx-auto">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ 
                duration: 1, 
                delay: index * 0.2, 
                ease: [0.22, 1, 0.36, 1],
              }}
              onMouseEnter={() => setHoveredCard(product.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onMouseMove={(e) => handleMouseMove(e, product.id)}
              className="relative group cursor-pointer"
              onClick={() => openModal(product)}
            >
              {/* Cursor-following gradient effect */}
              <div 
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: mousePosition[product.id] 
                    ? `radial-gradient(600px circle at ${mousePosition[product.id].x}% ${mousePosition[product.id].y}%, rgba(34, 211, 238, 0.2), transparent 40%)`
                    : 'none'
                }}
              />
              
              {/* Card container */}
              <div className="relative bg-gradient-to-br from-black/70 via-black/60 to-black/70 border border-blue-500/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl group-hover:border-cyan-400/60 transition-all duration-500">
                
                {/* Image section */}
                <div className="relative h-[450px] flex items-center justify-center p-12 overflow-hidden">
                  <div className="relative w-full h-full">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-contain drop-shadow-2xl"
                      priority
                    />
                  </div>
                </div>

                {/* Info section */}
                <div className="relative p-8 border-t border-blue-500/5 bg-gradient-to-b from-transparent to-black/40">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.4, duration: 0.6 }}
                    className="mb-2"
                  >
                    <p className="text-cyan-400/70 text-xs font-semibold mb-2 tracking-widest uppercase">
                      {product.subtitle}
                    </p>
                    <h3 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
                      {product.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {product.description}
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Enhanced hover tooltip */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ 
                  opacity: hoveredCard === product.id ? 1 : 0,
                  y: hoveredCard === product.id ? 0 : -10,
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-16 left-0 right-0 flex justify-center pointer-events-none z-20"
              >
                <div className="relative">
                  {/* Glow behind tooltip */}
                  <div className="absolute inset-0 bg-cyan-400/20 blur-lg rounded-lg" />
                  
                  {/* Arrow pointing up */}
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black/95 border-l border-t border-cyan-400/50 rotate-45" />
                  
                  <div className="relative bg-black/95 border border-cyan-400/50 px-5 py-2.5 rounded-lg backdrop-blur-xl shadow-2xl">
                    <p className="text-cyan-100 text-sm font-medium whitespace-nowrap flex items-center gap-2">
                      Click to view details
                      <ArrowRight className="w-4 h-4 animate-pulse" />
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Noise texture */}
      <div className="absolute inset-0 grain opacity-20 pointer-events-none" />

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Outer glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-cyan-400/30 to-blue-500/30 rounded-3xl blur-xl" />

              {/* Modal Container */}
              <div className="relative bg-black/95 border border-blue-500/30 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                >
                  <X className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </button>

                {/* Modal Content - Grid Layout */}
                <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                  {/* Left Side - Image */}
                  <div className="relative">
                    <div className="sticky top-0">
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-blue-500/10"
                      >
                        <Image
                          src={selectedProduct.image}
                          alt={selectedProduct.title}
                          fill
                          className="object-contain p-8"
                          priority
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Right Side - Details */}
                  <div className="space-y-6">
                    {/* Header */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    >
                      <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 border border-cyan-500/30 rounded-full bg-cyan-500/5 backdrop-blur-xl">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase">
                          {selectedProduct.subtitle}
                        </span>
                      </div>

                      <h2 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
                        {selectedProduct.title}
                      </h2>

                      <div className="flex items-baseline gap-3 mb-4">
                        <p className="text-5xl font-black bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                          {selectedProduct.price}
                        </p>
                        <span className="text-gray-500 text-sm">Limited Edition</span>
                      </div>

                      <p className="text-gray-300 leading-relaxed">
                        {selectedProduct.detailedDescription}
                      </p>
                    </motion.div>

                    {/* Features */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="space-y-3"
                    >
                      <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Key Features</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedProduct.features.map((feature: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-500/5 border border-blue-500/20 rounded-lg"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            <span className="text-sm text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Name Input */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                    >
                      <label className="flex items-center gap-3 text-white font-semibold mb-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
                          <User className="w-4 h-4 text-blue-400" />
                        </div>
                        Name on Product
                      </label>
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-cyan-400/30 rounded-xl opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-500" />
                        
                        <input
                          type="text"
                          value={nameValue}
                          onChange={(e) => setNameValue(e.target.value)}
                          placeholder="Enter your name"
                          className="relative w-full px-4 py-3 bg-black border border-blue-500/30 rounded-xl text-cyan-100 placeholder-gray-600 focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-all duration-300 backdrop-blur-xl hover:border-blue-400/40"
                        />
                      </div>
                    </motion.div>

                    {/* Year Selection */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55, duration: 0.6 }}
                    >
                      <label className="flex items-center gap-3 text-white font-semibold mb-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
                          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        Year
                      </label>
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-cyan-400/30 rounded-xl opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-500" />
                        
                        <select
                          value={yearValue}
                          onChange={(e) => setYearValue(e.target.value)}
                          className="relative w-full px-4 py-3 bg-black border border-blue-500/30 rounded-xl text-cyan-100 focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-all duration-300 backdrop-blur-xl hover:border-blue-400/40 appearance-none cursor-pointer"
                        >
                          <option value="" disabled className="bg-gray-900 text-gray-500">Select your year</option>
                          <option value="2nd Year" className="bg-gray-900 text-cyan-100">2nd Year</option>
                          <option value="3rd Year" className="bg-gray-900 text-cyan-100">3rd Year</option>
                          <option value="4th Year" className="bg-gray-900 text-cyan-100">4th Year</option>
                        </select>
                        
                        {/* Custom dropdown arrow */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </motion.div>

                    {/* Size Selection */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                    >
                      <label className="flex items-center gap-3 text-white font-semibold mb-8 text-sm">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
                          <Ruler className="w-4 h-4 text-blue-400" />
                        </div>
                        Select Size
                      </label>
                      <div className="grid grid-cols-6 gap-2">
                        {SIZES.map(({ size, measurement }) => (
                          <button
                            key={size}
                            onClick={() => {
                              setSelectedSize(size)
                              setShowCustomSizeInput(false)
                            }}
                            className="relative group"
                          >
                            <div className={`h-12 flex items-center justify-center rounded-xl text-base font-bold transition-all duration-300 ${
                              selectedSize === size
                                ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white border-cyan-400/50 shadow-lg shadow-blue-500/30'
                                : 'bg-black border border-blue-500/30 text-gray-400 hover:border-blue-400/50 hover:scale-105'
                            }`}>
                              {size}
                            </div>
                            
                            {/* Hover Tooltip */}
                            <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                              <div className="bg-gray-900 border border-blue-500/40 px-2 py-1 rounded-lg shadow-xl whitespace-nowrap">
                                <p className="text-cyan-100 text-xs font-semibold">{measurement}&quot;</p>
                              </div>
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 border-r border-b border-blue-500/40 rotate-45" />
                            </div>
                          </button>
                        ))}
                        
                        {/* Other Size Button */}
                        <button
                          onClick={() => {
                            setSelectedSize('Other')
                            setShowCustomSizeInput(true)
                          }}
                          className="relative group"
                        >
                          <div className={`h-12 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 ${
                            selectedSize === 'Other'
                              ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white border-cyan-400/50 shadow-lg shadow-blue-500/30'
                              : 'bg-black border border-blue-500/30 text-gray-400 hover:border-blue-400/50 hover:scale-105'
                          }`}>
                            Other
                          </div>
                        </button>
                      </div>
                      
                      {/* Custom Size Input */}
                      {showCustomSizeInput && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4"
                        >
                          <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-cyan-400/30 rounded-xl opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-500" />
                            
                            <input
                              type="text"
                              value={customSize}
                              onChange={(e) => setCustomSize(e.target.value)}
                              placeholder="Enter your size (e.g., XS)"
                              className="relative w-full px-4 py-3 bg-black border border-blue-500/30 rounded-xl text-cyan-100 placeholder-gray-600 focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-all duration-300 backdrop-blur-xl hover:border-blue-400/40"
                            />
                          </div>
                          <p className="text-gray-500 text-xs mt-2">Please specify your chest size in inches</p>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Grab Yours Button */}
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                      onClick={handleGrabYours}
                      disabled={!nameValue || !yearValue || (!selectedSize || (selectedSize === 'Other' && !customSize))}
                      className="relative w-full group overflow-hidden mt-8"
                      whileHover={{ scale: nameValue && yearValue && selectedSize && (selectedSize !== 'Other' || customSize) ? 1.02 : 1 }}
                      whileTap={{ scale: nameValue && yearValue && selectedSize && (selectedSize !== 'Other' || customSize) ? 0.98 : 1 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />
                      
                      <div className={`relative flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                        nameValue && yearValue && selectedSize && (selectedSize !== 'Other' || customSize)
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30 border border-cyan-400/30'
                          : 'bg-black/50 text-gray-600 cursor-not-allowed border border-blue-500/20'
                      }`}>
                        <span>Grab Yours Now</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.button>

                    {/* Note */}
                    <p className="text-center text-gray-500 text-xs">
                      Secure your exclusive IRC merchandise with personalized customization
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && orderDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
          >
            {/* Payment Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl border border-blue-500/30 shadow-2xl shadow-blue-500/20 overflow-hidden"
            >
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
              
              {/* Close Button */}
              <button
                onClick={closePaymentModal}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 border border-blue-500/30 hover:border-blue-400 transition-all z-10 group backdrop-blur-xl"
              >
                <X className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </button>

              {/* Modal Content */}
              <div className="relative p-8 space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 mb-2 border border-blue-500/30 rounded-full bg-blue-500/5 backdrop-blur-xl">
                    <span className="text-xs font-mono text-blue-400 tracking-wider uppercase">SCAN & PAY</span>
                  </div>
                  <h2 className="text-5xl font-black bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                    {orderDetails.product.price}
                  </h2>
                  <p className="text-gray-400 text-sm">Scan QR code to complete payment</p>
                </div>

                {/* QR Code Section */}
                <div className="relative bg-white rounded-2xl overflow-hidden">
                  <div className="relative w-full aspect-square">
                    <Image
                      src={orderDetails.product.id === 'jacket' 
                        ? 'https://res.cloudinary.com/dwwihknne/image/upload/v1769782879/jacket_qr_aczk1e.jpg'
                        : 'https://res.cloudinary.com/dwwihknne/image/upload/v1769782878/tshirt_qr_onlm6c.jpg'
                      }
                      alt="Payment QR Code"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>

                {/* UPI ID Display */}
                <div className="flex items-center justify-between gap-3 px-4 py-3 bg-blue-500/10 border border-blue-500/30 rounded-xl backdrop-blur-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 uppercase tracking-wider">UPI ID</span>
                    <span className="text-sm font-mono text-cyan-400">9337511652@yespop</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('9337511652@yespop')
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg transition-all group"
                  >
                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs text-cyan-400 font-semibold">Copy</span>
                  </button>
                </div>

                {/* Transaction ID Input */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-white text-sm font-semibold">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Transaction ID
                    <span className="text-red-400">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-cyan-400/30 rounded-xl opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-500" />
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="Enter transaction ID from payment app"
                      className="relative w-full px-4 py-3 bg-black border border-blue-500/30 rounded-xl text-cyan-100 placeholder-gray-600 focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-all duration-300 backdrop-blur-xl"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl"
                  >
                    <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{submitError}</p>
                  </motion.div>
                )}

                {/* Success Message */}
                {orderSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-xl"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <p className="text-green-400 text-sm font-semibold">Order submitted successfully!</p>
                  </motion.div>
                )}

                {/* Confirm Button */}
                <motion.button
                  onClick={handleConfirmOrder}
                  disabled={!transactionId || isSubmitting || orderSuccess}
                  className="relative w-full group overflow-hidden"
                  whileHover={{ scale: (transactionId && !isSubmitting && !orderSuccess) ? 1.02 : 1 }}
                  whileTap={{ scale: (transactionId && !isSubmitting && !orderSuccess) ? 0.98 : 1 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />
                  
                  <div className={`relative flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                    (transactionId && !isSubmitting && !orderSuccess)
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30 border border-cyan-400/30'
                      : 'bg-black/50 text-gray-600 cursor-not-allowed border border-blue-500/20'
                  }`}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : orderSuccess ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Order Confirmed!</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm Order</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </motion.button>

                {/* Note */}
                <p className="text-center text-gray-500 text-xs">
                  Save your transaction ID for reference
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default memo(ModelPlaceholder)
