'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { User, Shirt, CheckCircle2, QrCode, Sparkles, ArrowRight, X, CreditCard, Loader2, AlertCircle } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { submitOrder } from '@/lib/orderService'

const TshirtModel = dynamic(() => import('./TshirtModel'), { ssr: false })
const Threads = dynamic(() => import('./Threads'), { ssr: false })

const orderSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
  size: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL'], {
    required_error: 'Please select a size',
  }),
  transactionId: z.string().min(6, 'Transaction ID must be at least 6 characters').max(50, 'Transaction ID is too long'),
})

type OrderFormData = z.infer<typeof orderSchema>

const SIZES = [
  { size: 'XS', measurement: '34' },
  { size: 'S', measurement: '36' },
  { size: 'M', measurement: '38' },
  { size: 'L', measurement: '40' },
  { size: 'XL', measurement: '42' },
  { size: 'XXL', measurement: '44' },
]

export default function OrderForm() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [showQRModal, setShowQRModal] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    mode: 'onChange',
  })

  const nameValue = watch('name')
  const sizeValue = watch('size')
  const transactionIdValue = watch('transactionId')

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const result = await submitOrder({
        name: data.name,
        size: data.size,
        transactionId: data.transactionId,
      })

      if (result.success) {
        setIsSubmitted(true)
        setOrderId(result.orderId || null)
        reset() // Clear form
        
        // Close QR modal if open
        setShowQRModal(false)
        
        // Scroll to success message
        setTimeout(() => {
          ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
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

  const handleShowQR = () => {
    if (nameValue && sizeValue) {
      setShowQRModal(true)
    }
  }

  return (
    <section
      ref={ref}
      className="relative min-h-screen overflow-hidden py-20"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Threads Background Effect */}
      <div className="absolute inset-0 opacity-20" style={{ zIndex: 1 }}>
        <Threads
          color={[0.4, 0.85, 1.0]} // Ice blue matching smoke (#66D9FF)
          amplitude={0.6}
          distance={0.05}
          enableMouseInteraction
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 border border-blue-500/30 rounded-full bg-blue-500/5 backdrop-blur-xl">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-mono text-blue-400 tracking-wider uppercase">
              Limited Pieces Available
            </span>
          </div>

          <h2 className="font-display text-5xl md:text-7xl font-black mb-6 tracking-tight">
            <span className="bg-gradient-to-br from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
              Reserve Yours
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Fill in your details and secure your exclusive IRC merchandise
          </p>
        </motion.div>

        {/* Single Column Centered Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Success Message */}
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-6 bg-gradient-to-br from-green-950/50 to-green-900/30 border border-green-500/30 rounded-2xl backdrop-blur-xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-400 mb-0.5">Order Submitted Successfully!</h3>
                  <p className="text-gray-400 text-sm">We&apos;ll contact you soon for confirmation.</p>
                </div>
              </div>
              {orderId && (
                <div className="mt-3 pt-3 border-t border-green-500/20">
                  <p className="text-xs text-gray-500 mb-1">Order ID:</p>
                  <code className="text-green-300 text-sm font-mono bg-green-950/50 px-3 py-1.5 rounded-lg border border-green-500/20 inline-block">
                    {orderId}
                  </code>
                </div>
              )}
            </motion.div>
          )}

          {/* Error Message */}
          {submitError && !isSubmitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-6 bg-gradient-to-br from-red-950/50 to-red-900/30 border border-red-500/30 rounded-2xl backdrop-blur-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-400 mb-0.5">Submission Failed</h3>
                  <p className="text-gray-400 text-sm">{submitError}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Enhanced glow effect - brighter edge highlights */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/40 via-cyan-400/40 to-blue-500/40 rounded-3xl blur-sm" />
          
          {/* Secondary glow layer */}
          <div className="absolute -inset-3 bg-gradient-to-br from-blue-600/20 via-cyan-500/20 to-blue-600/20 rounded-3xl blur-2xl opacity-50" />
          
          {/* Form Container - Much Darker */}
          <div className="relative bg-black/95 border border-blue-500/30 rounded-3xl p-10 md:p-12 backdrop-blur-xl shadow-2xl shadow-blue-500/10">
            {/* Inner edge highlight */}
            <div className="absolute inset-0 rounded-3xl border border-cyan-500/20 pointer-events-none" />
            
            <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-6">
              {/* Name Input */}
              <div>
                <label className="flex items-center gap-3 text-white font-semibold mb-3 text-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  Name on T-Shirt
                </label>
                <div className="relative group">
                  {/* Input glow effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-cyan-400/30 rounded-2xl opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-500" />
                  
                  <input
                    {...register('name')}
                    type="text"
                    placeholder="Enter your name"
                    className="relative w-full px-6 py-4 bg-black border border-blue-500/30 rounded-2xl text-cyan-100 placeholder-gray-600 focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-all duration-300 text-lg backdrop-blur-xl hover:border-blue-400/40"
                  />
                </div>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-red-400 text-sm mt-3 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-red-400" />
                    {errors.name.message}
                  </motion.p>
                )}
                {nameValue && !errors.name && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-green-400 text-sm mt-3 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Perfect!
                  </motion.p>
                )}
              </div>

              {/* Size Selection */}
              <div>
                <label className="flex items-center gap-3 text-white font-semibold mb-3 text-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
                    <Shirt className="w-5 h-5 text-blue-400" />
                  </div>
                  Select Size
                </label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {SIZES.map(({ size, measurement }) => (
                    <label key={size} className="relative cursor-pointer group">
                      <input
                        {...register('size')}
                        type="radio"
                        value={size}
                        className="peer sr-only"
                      />
                      {/* Button hover glow */}
                      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500/40 to-cyan-400/40 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
                      
                      {/* Hover Tooltip */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        <div className="bg-gray-900 border border-blue-500/40 px-3 py-1.5 rounded-lg shadow-xl">
                          <p className="text-cyan-100 text-xs font-semibold whitespace-nowrap">Size: {measurement}&quot;</p>
                        </div>
                        {/* Arrow */}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 border-r border-b border-blue-500/40 rotate-45" />
                      </div>
                      
                      <div className="relative h-14 flex items-center justify-center bg-black border border-blue-500/30 rounded-2xl text-lg font-bold text-gray-400 transition-all duration-300 peer-checked:bg-gradient-to-br peer-checked:from-blue-600 peer-checked:to-cyan-600 peer-checked:text-white peer-checked:border-cyan-400/50 peer-checked:shadow-lg peer-checked:shadow-blue-500/30 group-hover:border-blue-400/50 group-hover:scale-105 backdrop-blur-sm">
                        {size}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                    </label>
                  ))}
                </div>
                {errors.size && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-red-400 text-sm mt-3 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-red-400" />
                    {errors.size.message}
                  </motion.p>
                )}
              </div>

              {/* Show QR Button */}
              <motion.button
                type="button"
                onClick={handleShowQR}
                disabled={!nameValue || !sizeValue}
                className="relative w-full group overflow-hidden"
                whileHover={{ scale: nameValue && sizeValue ? 1.02 : 1 }}
                whileTap={{ scale: nameValue && sizeValue ? 0.98 : 1 }}
              >
                {/* Animated glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl animate-shimmer" />
                
                <div className={`relative flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                  nameValue && sizeValue
                    ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/30 border border-cyan-400/30'
                    : 'bg-black text-gray-600 cursor-not-allowed border border-blue-500/20'
                }`}>
                  <QrCode className="w-5 h-5" />
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Payment QR Modal */}
        <AnimatePresence>
          {showQRModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto"
              onClick={() => setShowQRModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative w-full max-w-md my-4"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Outer Glow - Subtle */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-cyan-400/20 to-blue-500/20 rounded-2xl blur-md" />
                
                {/* Modal Container */}
                <div className="relative bg-black border border-blue-500/40 rounded-2xl overflow-hidden">
                  {/* Animated gradient border - Subtle */}
                  <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-blue-500/20 via-cyan-400/20 to-blue-500/20 opacity-30 animate-shimmer pointer-events-none" />
                  
                  {/* Close Button */}
                  <button
                    onClick={() => setShowQRModal(false)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                  >
                    <X className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                  </button>

                  {/* Modal Content */}
                  <div className="relative p-4">
                    {/* Header */}
                    <div className="text-center mb-3">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-2 border border-blue-500/30 rounded-full bg-blue-500/10 backdrop-blur-xl">
                        <QrCode className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                        <span className="text-xs font-mono text-blue-400 tracking-wider uppercase">
                          Scan & Pay
                        </span>
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-black mb-1 bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
                        ₹529
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Scan QR code to complete payment
                      </p>
                    </div>

                    {/* QR Code Image - Compact */}
                    <div className="relative mb-3">
                      {/* Glow around QR - Subtle */}
                      <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500/15 via-cyan-400/15 to-blue-500/15 rounded-2xl blur-lg" />
                      
                      <div className="relative bg-white rounded-xl p-1.5 shadow-xl shadow-blue-500/10 mx-auto max-w-sm">
                        <Image
                          src="/qr.jpeg"
                          alt="Payment QR Code"
                          width={400}
                          height={400}
                          className="w-full h-auto rounded-lg"
                          priority
                        />
                      </div>
                    </div>

                    {/* UPI ID */}
                    <div className="text-center mb-3">
                      <p className="text-gray-500 text-xs mb-1.5">UPI ID</p>
                      <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-full backdrop-blur-xl">
                        <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                        <p className="text-cyan-100 font-mono text-sm font-semibold">9337511652@yespop</p>
                      </div>
                    </div>

                    {/* Transaction ID Input */}
                    <div className="mb-3">
                      <label className="flex items-center gap-2 text-white font-semibold mb-2 text-sm">
                        <div className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
                          <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                        Transaction ID
                        <span className="text-red-400">*</span>
                      </label>
                      
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-cyan-400/30 rounded-xl opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-500" />
                        
                        <input
                          {...register('transactionId')}
                          type="text"
                          placeholder="Enter transaction ID from payment app"
                          className="relative w-full px-4 py-2.5 bg-black border border-blue-500/30 rounded-xl text-cyan-100 placeholder-gray-600 focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-all duration-300 text-sm backdrop-blur-xl hover:border-blue-400/40"
                        />
                      </div>
                      
                      {errors.transactionId && (
                        <motion.p
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-red-400 text-xs mt-1.5 flex items-center gap-2"
                        >
                          <span className="w-1 h-1 rounded-full bg-red-400" />
                          {errors.transactionId.message}
                        </motion.p>
                      )}
                      
                      {transactionIdValue && !errors.transactionId && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-green-400 text-xs mt-1.5 flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Transaction ID verified
                        </motion.p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="button"
                      onClick={handleSubmit(onSubmit)}
                      disabled={!transactionIdValue || isSubmitted || isSubmitting}
                      className="relative w-full group overflow-hidden"
                      whileHover={{ scale: transactionIdValue && !isSubmitted && !isSubmitting ? 1.02 : 1 }}
                      whileTap={{ scale: transactionIdValue && !isSubmitted && !isSubmitting ? 0.98 : 1 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />
                      
                      <div className={`relative flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-base transition-all duration-300 ${
                        transactionIdValue && !isSubmitted && !isSubmitting
                          ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-xl shadow-green-500/30 border border-green-400/40'
                          : 'bg-black/50 text-gray-600 cursor-not-allowed border border-blue-500/20'
                      }`}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : isSubmitted ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Order Submitted!</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Confirm Order</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </div>
                    </motion.button>

                    <p className="text-center text-gray-500 text-xs mt-2">
                      {isSubmitting ? 'Please wait...' : 'Save your transaction ID for reference'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-4 mt-16"
        >
          {[
            { icon: Shirt, label: 'Premium Quality', desc: 'Best fabric' },
            { icon: CheckCircle2, label: 'Limited Edition', desc: 'Exclusive design' },
            { icon: User, label: 'Custom Names', desc: 'Personalized' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-6 bg-gradient-to-br from-gray-950/50 to-black/50 border border-white/10 rounded-2xl backdrop-blur-xl"
            >
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <item.icon className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-semibold">{item.label}</p>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Noise texture */}
      <div className="absolute inset-0 grain opacity-20 pointer-events-none" />
    </section>
  )
}
