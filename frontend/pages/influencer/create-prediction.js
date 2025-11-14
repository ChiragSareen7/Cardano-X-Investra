import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { toast, Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

import Navbar from '@/components/layout/Navbar';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectGroup,
  SelectItem, 
  SelectLabel,
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  ChevronRight, 
  User, 
  DollarSign, 
  Bitcoin, 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Star, 
  Upload,
  AlertCircle,
  CheckCircle,
  Loader2,
  FileText, 
  Trash2, 
  Shield, 
  X, 

  Share2 
} from 'lucide-react';

const CreatePredictionPage = () => {
  const [activeTab, setActiveTab] = useState('setup');
  const [userName, setUserName] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const router = useRouter();
  const fileInputRef = useRef(null);
  const { theme } = useTheme();
  
  // Get user name from local storage and check wallet connection
  useEffect(() => {
    const storedName = localStorage.getItem('userName') || 'Anonymous';
    setUserName(storedName);
    checkWalletConnection();
  }, []);

  // Check wallet connection
  const checkWalletConnection = async () => {
    try {
      const { getSavedWalletConnection } = await import('@/lib/cardano');
      const savedConnection = getSavedWalletConnection();
      if (savedConnection) {
        setUserAddress(savedConnection.address);
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    try {
      const {
        connectEternlWallet,
        isEternlInstalled,
        saveWalletConnection
      } = await import('@/lib/cardano');

      if (!isEternlInstalled()) {
        toast.error('Please install Eternl wallet to connect');
        return;
      }

      const { address, walletName } = await connectEternlWallet();
      saveWalletConnection(address, walletName);
      
      setUserAddress(address);
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error(error.message || 'Failed to connect wallet');
    }
  };
  
  // Initialize form with useState and validation errors
  const [formData, setFormData] = useState({
    category: '',
    asset: '',
    predictionType: 'priceTarget',
    targetPrice: '',
    deadline: '',
    confidence: 3,
    reasoning: '',
    confirmed: false,
  });
  
  // Validation errors state
  const [errors, setErrors] = useState({
    category: '',
    asset: '',
    targetPrice: '',
    deadline: '',
    reasoning: '',
  });
  
  // File upload states
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileValidations, setFileValidations] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  
  // Validation states
  const [assetOptions, setAssetOptions] = useState([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [validationPercentage, setValidationPercentage] = useState(0);
  const [validationError, setValidationError] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [reasoningValidation, setReasoningValidation] = useState(null);
  
  const handleChange = (name, value) => {
    // Special handling for category changes
    if (name === 'category') {
      // Clear asset when category changes
      setFormData(prev => ({
        ...prev,
        [name]: value,
        asset: '' // Reset asset when category changes
      }));
    } else {
      // Normal field update
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Fetch assets based on selected category using static popular values
  const fetchAssetsByCategory = useCallback((category) => {
    if (!category) return;
    
    setIsLoadingAssets(true);
    
    // Create a slight delay to show loading state for better UX
    setTimeout(() => {
      try {
        let assets = [];
        
        if (category === 'crypto') {
          // Static popular cryptocurrency data
          assets = [
            { value: 'BTC', label: 'BTC - Bitcoin' },
            { value: 'ETH', label: 'ETH - Ethereum' },
            { value: 'SOL', label: 'SOL - Solana' },
            { value: 'BNB', label: 'BNB - Binance Coin' },
            { value: 'ADA', label: 'ADA - Cardano' },
            { value: 'XRP', label: 'XRP - Ripple' },
            { value: 'DOT', label: 'DOT - Polkadot' },
            { value: 'DOGE', label: 'DOGE - Dogecoin' },
            { value: 'AVAX', label: 'AVAX - Avalanche' },
            { value: 'MATIC', label: 'MATIC - Polygon' },
            { value: 'LINK', label: 'LINK - Chainlink' },
            { value: 'UNI', label: 'UNI - Uniswap' },
            { value: 'ATOM', label: 'ATOM - Cosmos' },
            { value: 'NEAR', label: 'NEAR - Near Protocol' },
            { value: 'AAVE', label: 'AAVE - Aave' }
          ];
        } else if (category === 'equities') {
          // Static popular Indian equity data
          assets = [
            { value: 'AAPL.NASDAQ', label: 'AAPL.NASDAQ - Apple Inc' },
            { value: 'RELIANCE.BSE', label: 'RELIANCE.BSE - Reliance Industries Ltd' },
            { value: 'TCS.BSE', label: 'TCS.BSE - Tata Consultancy Services Ltd' },
            { value: 'HDFCBANK.BSE', label: 'HDFCBANK.BSE - HDFC Bank Ltd' },
            { value: 'INFY.BSE', label: 'INFY.BSE - Infosys Ltd' },
            { value: 'HINDUNILVR.BSE', label: 'HINDUNILVR.BSE - Hindustan Unilever Ltd' },
            { value: 'ICICIBANK.BSE', label: 'ICICIBANK.BSE - ICICI Bank Ltd' },
            { value: 'BAJFINANCE.BSE', label: 'BAJFINANCE.BSE - Bajaj Finance Ltd' },
            { value: 'SBIN.BSE', label: 'SBIN.BSE - State Bank of India' },
            { value: 'BHARTIARTL.BSE', label: 'BHARTIARTL.BSE - Bharti Airtel Ltd' },
            { value: 'KOTAKBANK.BSE', label: 'KOTAKBANK.BSE - Kotak Mahindra Bank Ltd' },
            { value: 'TATAMOTORS.BSE', label: 'TATAMOTORS.BSE - Tata Motors Ltd' },
            { value: 'WIPRO.BSE', label: 'WIPRO.BSE - Wipro Ltd' },
            { value: 'ITC.BSE', label: 'ITC.BSE - ITC Ltd' },
            { value: 'LT.BSE', label: 'LT.BSE - Larsen & Toubro Ltd' },
            { value: 'HCLTECH.BSE', label: 'HCLTECH.BSE - HCL Technologies Ltd' }
          ];
        } else if (category === 'commodities') {
          // Static popular commodity data
          assets = [
            { value: 'GOLD', label: 'GOLD - Gold' },
            { value: 'SILVER', label: 'SILVER - Silver' },
            { value: 'CRUDE', label: 'CRUDE - Crude Oil' },
            { value: 'NG', label: 'NG - Natural Gas' },
            { value: 'COPPER', label: 'COPPER - Copper' },
            { value: 'ALUMINUM', label: 'ALUMINUM - Aluminum' },
            { value: 'WHEAT', label: 'WHEAT - Wheat' },
            { value: 'COTTON', label: 'COTTON - Cotton' }
          ];
        } else if (category === 'indices') {
          // Static popular indices data
          assets = [
            { value: 'NIFTY50', label: 'NIFTY50 - Nifty 50 Index' },
            { value: 'SENSEX', label: 'SENSEX - BSE Sensex' },
            { value: 'BANKNIFTY', label: 'BANKNIFTY - Bank Nifty' },
            { value: 'FINNIFTY', label: 'FINNIFTY - Fin Nifty' },
            { value: 'NIFTYNEXT50', label: 'NIFTYNEXT50 - Nifty Next 50' },
            { value: 'NIFTYMIDCAP100', label: 'NIFTYMIDCAP100 - Nifty Midcap 100' },
            { value: 'NIFTYSMALLCAP100', label: 'NIFTYSMALLCAP100 - Nifty Smallcap 100' }
          ];
        }
        
        setAssetOptions(assets);
        // Reset the asset when category changes
        setFormData(prev => ({
          ...prev,
          asset: ''
        }));
      } catch (error) {
        console.error('Error setting asset options:', error);
        setAssetOptions([
          { value: 'default', label: 'Error loading assets' }
        ]);
      } finally {
        setIsLoadingAssets(false);
      }
    }, 300); // Small delay to show loading state
  }, []); // No dependencies since we removed handleChange
  
  // Validate prediction through AI APIs
  const validatePrediction = async () => {
    if (!validateReasoningFields()) {
      return;
    }
    
    setIsValidating(true);
    setValidationError("");
    
    try {
      // Send reasoning to Groq API for validation
      const groqResponse = await fetch('/api/validate-reasoning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reasoning: formData.reasoning }),
      });
      
      const groqData = await groqResponse.json();
      setReasoningValidation(groqData);
      
      // Calculate total validation score
      const totalScore = getTotalValidationScore();
      setValidationPercentage(totalScore);
      
      // Always allow validation to pass - no percentage threshold blocking
      toast.success("Validation complete! You can now proceed to preview.");
      
    } catch (error) {
      console.error('Error validating prediction:', error);
      setValidationError("Error validating prediction. Please try again.");
      toast.error("Error validating prediction. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };
  
  // Validate setup form fields
  const validateSetupFields = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
      isValid = false;
    }
    
    if (!formData.asset) {
      newErrors.asset = 'Please select an asset';
      isValid = false;
    }
    
    if (!formData.targetPrice) {
      newErrors.targetPrice = 'This field is required';
      isValid = false;
    } else if (formData.predictionType !== 'event') {
      // Validate if number for price target and percentage types
      if (!/^-?\d*\.?\d+%?$/.test(formData.targetPrice)) {
        newErrors.targetPrice = 'Please enter a valid number';
        isValid = false;
      }
    }
    
    if (!formData.deadline) {
      newErrors.deadline = 'Please select a deadline';
      isValid = false;
    } else {
      const selectedDate = new Date(formData.deadline);
      const today = new Date();
      if (selectedDate <= today) {
        newErrors.deadline = 'Deadline must be in the future';
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const validateReasoningFields = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    if (!formData.reasoning || formData.reasoning.trim().length < 20) {
      newErrors.reasoning = 'Please provide detailed reasoning (at least 20 characters)';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleTabChange = (nextTab) => {
    if (activeTab === 'setup' && nextTab === 'reasoning') {
      if (!validateSetupFields()) return;
    }
    
    // No threshold blocking - allow navigation
    if (activeTab === 'reasoning' && (nextTab === 'preview' || nextTab === 'submit')) {
      // Validation is optional - allow proceeding
    }
    
    setActiveTab(nextTab);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.confirmed) {
      toast.error("Please confirm your submission");
      return;
    }

    // No validation threshold blocking - allow submission

    try {
      // Submit to DAO for voting (all predictions go through DAO now)
      await submitToDAO();
    } catch (err) {
      console.error("Transaction failed:", err);
      toast.error("Transaction failed: " + (err.message || "Unknown error"));
    }
  };



  const submitToDAO = async () => {
    try {
      // Create prediction title and description
      const predictionTitle = `${formData.asset} ${formData.predictionType === 'priceTarget' ? 'will reach ' + formData.targetPrice : 
                            formData.predictionType === 'percentage' ? 'will change by ' + formData.targetPrice : 
                            'will ' + formData.targetPrice} by ${formData.deadline}`;
      
      const predictionDescription = formData.reasoning;
      
      // Prepare original prediction data for comprehensive storage
      const sources = uploadedFiles.map(file => ({
        name: file.name,
        type: file.type,
        validation: fileValidations[file.id] || { trustLevel: 'unverified', score: 0 }
      }));

      const originalPredictionData = {
        validationScore: validationPercentage,
        sources: sources,
        perplexityCheck: reasoningValidation,
        formData: {
          category: formData.category,
          asset: formData.asset,
          predictionType: formData.predictionType,
          targetPrice: formData.targetPrice,
          deadline: formData.deadline,
          confidence: formData.confidence,
          confirmed: formData.confirmed
        },
        aiValidation: {
          reasoningScore: reasoningValidation?.score || 0,
          sourceCredibility: validationPercentage,
          marketRelevance: 85, // Default value
          overallScore: validationPercentage,
          validationPassed: validationMeetsThreshold(),
          validationDate: new Date()
        }
      };

      // Submit to DAO backend via Next.js API route
      const response = await fetch('/api/dao/predictions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: predictionTitle,
          description: predictionDescription,
          category: formData.category,
          votingPeriod: 7, // 7 days voting period
          creator: userAddress || 'Anonymous',
          originalPredictionData: originalPredictionData
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        const errorMsg = result.message || 'Failed to submit to DAO';
        const hint = result.hint ? `\n\n${result.hint}` : '';
        throw new Error(`${errorMsg}${hint}`);
      }

      toast.success("Prediction submitted to DAO for community voting!");
      
      // Redirect to community hub after successful submission
      setTimeout(() => {
        router.push('/influencer/community-hub');
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting to DAO:', error);
      throw error;
    }
  };

  // Function to store prediction data in MongoDB
  const storePredictionInMongoDB = async () => {
    try {
      // Prepare sources data
      const sources = uploadedFiles.map(file => ({
        name: file.name,
        type: file.type,
        validation: fileValidations[file.id] || { trustLevel: 'unverified', score: 0 }
      }));

      const predictionData = {
        predictionText: `${formData.asset} will ${formData.predictionType === 'priceTarget' ? 'reach' : 
                        formData.predictionType === 'percentage' ? 'change by' : 
                        'will ' + formData.targetPrice} by ${formData.deadline}`,
        reasoning: formData.reasoning,
        validationScore: validationPercentage,
        sources: sources,
        perplexityCheck: reasoningValidation,
        createdBy: walletAddress,
        formData: {
          category: formData.category,
          asset: formData.asset,
          predictionType: formData.predictionType,
          targetPrice: formData.targetPrice,
          deadline: formData.deadline,
          confidence: formData.confidence,
          confirmed: formData.confirmed
        },
        aiValidation: {
          reasoningScore: reasoningValidation?.score || 0,
          sourceCredibility: validationPercentage,
          marketRelevance: 85,
          overallScore: validationPercentage,
          validationPassed: validationMeetsThreshold(),
          validationDate: new Date()
        },
        status: 'submitted-to-dao',
        metadata: {
          submissionMethod: 'web'
        }
      };

      const response = await fetch('/api/prediction-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(predictionData)
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Prediction saved to database successfully!');
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to save prediction');
      }
    } catch (error) {
      console.error('Error storing prediction in MongoDB:', error);
      toast.error('Failed to save prediction to database');
      throw error;
    }
  };

  // Function to handle "Continue to Community Hub" button
  const handleContinueToCommunityHub = async () => {
    try {
      // Store prediction data in MongoDB
      await storePredictionInMongoDB();
      
      // Redirect to community hub
      router.push('/influencer/community-hub');
    } catch (error) {
      console.error('Error continuing to community hub:', error);
      // Still redirect even if storage fails (for demo purposes)
      router.push('/influencer/community-hub');
    }
  };

  const submitToRegularContract = async () => {
    // First save to MongoDB
    const sources = uploadedFiles.map(file => ({
      name: file.name,
      type: file.type,
      validation: fileValidations[file.id] || { trustLevel: 'unverified', score: 0 }
    }));

    const mongoResponse = await fetch('/api/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        predictionText: `${formData.asset} ${formData.predictionType === 'priceTarget' ? 'will reach ' + formData.targetPrice : 
                        formData.predictionType === 'percentage' ? 'will change by ' + formData.targetPrice : 
                        'will ' + formData.targetPrice} by ${formData.deadline}`,
        reasoning: formData.reasoning,
        validationScore: validationPercentage,
        sources: sources,
        perplexityCheck: reasoningValidation,
        createdBy: userName,
        createdAt: new Date().toISOString()
      }),
    });

    const mongoData = await mongoResponse.json();
    
    if (!mongoResponse.ok) {
      throw new Error(mongoData.error || 'Error saving to database');
    }

    // TODO: Submit to Cardano blockchain (will be implemented after contract deployment)
    // For now, prediction is saved to MongoDB only
    // Cardano blockchain submission will be added in next phase
    console.log('Prediction saved to database. Cardano blockchain submission coming soon.');
    toast.success("Prediction saved successfully! (Cardano blockchain integration coming soon)");
    
    // Redirect to community hub
    setTimeout(() => {
      router.push('/influencer/community-hub');
    }, 2000);
  };
  
  const getConfidenceColor = (level) => {
    const colors = [
      'text-red-500',
      'text-orange-500',
      'text-yellow-500',
      'text-green-400',
      'text-green-500'
    ];
    return colors[level - 1] || 'text-white';
  };
  
  // We don't need this effect anymore as we're triggering fetchAssetsByCategory directly in the onValueChange handler
  // for better control over the flow and to ensure assets are updated at the right time
  
  // File upload handling
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    // Check file types
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                         'image/png', 'image/jpeg', 'text/plain'];
    
    const validFiles = files.filter(file => allowedTypes.includes(file.type));
    
    if (validFiles.length !== files.length) {
      toast.error('Only PDF, DOCX, PNG, JPG, and TXT files are allowed');
    }
    
    // Process each valid file
    for (const file of validFiles) {
      try {
        // Create a preview for the file
        const fileWithPreview = Object.assign(file, {
          preview: URL.createObjectURL(file),
          id: Date.now() + Math.random().toString(36).substring(2, 9)
        });
        
        setUploadedFiles(prev => [...prev, fileWithPreview]);
        
        // Send the file to Perplexity API for validation
        await validateFileWithPerplexity(fileWithPreview);
      } catch (error) {
        console.error('Error processing file:', error);
        toast.error(`Error processing file ${file.name}`);
      }
    }
    
    setIsUploading(false);
    // Clear the file input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Remove a file from the uploaded files
  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    setFileValidations(prev => {
      const updated = { ...prev };
      delete updated[fileId];
      return updated;
    });
  };
  
  // Validate a file with Perplexity API
  const validateFileWithPerplexity = async (file) => {
    try {
      // Create FormData for file upload
      const fileUploadData = new FormData();
      fileUploadData.append('file', file);
      fileUploadData.append('predictionText', `${formData.asset} ${formData.predictionType === 'priceTarget' ? 'will reach ' + formData.targetPrice : 
                formData.predictionType === 'percentage' ? 'will change by ' + formData.targetPrice : 
                'will ' + formData.targetPrice} by ${formData.deadline}`);
      
      // Send file to Perplexity API via your Next.js API route
      const response = await fetch('/api/validate-document', {
        method: 'POST',
        body: fileUploadData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error validating document');
      }
      
      // Update file validations with the result
      setFileValidations(prev => ({
        ...prev,
        [file.id]: data
      }));
      
    } catch (error) {
      console.error('Error validating file with Perplexity:', error);
      // Set a default validation with error status
      setFileValidations(prev => ({
        ...prev,
        [file.id]: {
          trustLevel: 'unverified',
          score: 0,
          summary: 'Error validating document',
          error: true
        }
      }));
    }
  };
  
  // Get the total validation score (max 50% from reasoning, max 50% from documents)
  const getTotalValidationScore = () => {
    // Calculate reasoning score component (max 50%)
    const reasoningScore = reasoningValidation ? (reasoningValidation.score / 100) * 50 : 0;
    
    // Calculate documents score component (max 50%)
    let documentsScore = 0;
    const validations = Object.values(fileValidations);
    if (validations.length > 0) {
      // Find the highest scoring document
      const highestScore = Math.max(...validations.map(v => v.score || 0));
      documentsScore = (highestScore / 100) * 50;
    }
    
    return Math.round(reasoningScore + documentsScore);
  };
  
  // Check if the validation meets the threshold - always return true (no blocking)
  const validationMeetsThreshold = () => {
    // No percentage threshold - always allow validation
    return true;
  };   // Animation variants
   const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
   };
   
   const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
   };
   
   return (
    <>
      <Navbar />
      <Toaster position="top-right" />
      <div className="min-h-screen pt-24 p-4 md:p-8 lg:p-10
                    dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-950 dark:to-gray-900
                    bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 
                    transition-colors duration-300">
        {/* Breadcrumb navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto max-w-7xl mb-8"
        >
          <div className="flex items-center dark:text-gray-300 text-gray-700 
                        bg-white/90 dark:bg-gray-800/40 
                        px-6 py-3 rounded-xl shadow-sm backdrop-blur-sm
                        border border-gray-100/40 dark:border-gray-700/40">
            <Home size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
            <span className="mr-2 text-sm font-medium">Dashboard</span>
            <ChevronRight size={16} className="mx-2 text-gray-400" />
            <span className="text-blue-600 dark:text-cyan-400 font-medium text-sm">Create Prediction</span>
            <div className="ml-auto flex items-center bg-blue-50/80 dark:bg-gray-800/70 
                          rounded-full px-4 py-1.5 text-blue-600 dark:text-cyan-300 
                          shadow-sm border border-blue-100/50 dark:border-gray-700/50">
              <User size={16} className="mr-2" />
              <span className="font-medium text-sm">{userName}'s Next Prediction</span>
            </div>
          </div>
        </motion.div>
        
        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="container mx-auto max-w-7xl"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-8 shadow-md bg-white dark:bg-gray-800/60 
                      border border-gray-100/80 dark:border-gray-700/80 rounded-xl overflow-hidden
                      backdrop-blur-sm">
              <TabsTrigger 
                value="setup" 
                className="py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600
                          data-[state=active]:text-white dark:text-gray-200 text-gray-700
                          transition-all duration-300 font-medium"
              >
                Setup
              </TabsTrigger>
              <TabsTrigger 
                value="reasoning" 
                className="py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600
                          data-[state=active]:text-white dark:text-gray-200 text-gray-700
                          transition-all duration-300 font-medium"
              >
                Reasoning
              </TabsTrigger>
              <TabsTrigger 
                value="preview" 
                className="py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600
                          data-[state=active]:text-white dark:text-gray-200 text-gray-700
                          transition-all duration-300 font-medium"
              >
                Preview
              </TabsTrigger>
              <TabsTrigger 
                value="submit" 
                className="py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600
                          data-[state=active]:text-white dark:text-gray-200 text-gray-700
                          transition-all duration-300 font-medium"
              >
                Submit
              </TabsTrigger>
            </TabsList>
          
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LEFT SECTION: Prediction Form */}
              <motion.div 
                className="lg:col-span-2 space-y-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-white dark:bg-gray-900/50 border border-gray-100/80 dark:border-gray-800/80 
                              shadow-xl hover:shadow-2xl transition-all duration-500 backdrop-blur-sm
                              rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800/70 dark:to-indigo-900/20 pb-8">
                    <CardTitle className="text-2xl md:text-3xl text-gray-800 dark:text-white font-bold flex items-center">
                      <span className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-2 mr-3 shadow-md">
                        <TrendingUp size={24} className="text-white" />
                      </span>
                      Create New Prediction
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400 mt-2 text-base">
                      Create a detailed market prediction to share with your community
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <TabsContent value="setup" className="space-y-8 pt-4">
                        <AnimatePresence mode="wait">
                          <motion.div 
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="space-y-8"
                          >
                            {/* Category Selector */}
                            <motion.div variants={fadeIn} className="group">
                              <div className="relative">
                                <label className="absolute -top-2 left-3 px-1 text-xs font-medium text-gray-600 dark:text-gray-300 
                                                bg-white dark:bg-gray-900 z-10 transition-all duration-200">
                                  Category*
                                </label>
                                <Select 
                                  onValueChange={(value) => {
                                    // Update formData.category and trigger fetchAssetsByCategory
                                    handleChange('category', value);
                                    fetchAssetsByCategory(value);
                                  }}
                                  value={formData.category}
                                >
                                  <SelectTrigger className="bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 
                                                       text-gray-800 dark:text-white shadow-sm hover:shadow-md transition-all
                                                       rounded-xl h-14 px-4 focus-within:border-blue-400 dark:focus-within:border-blue-500">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-60 overflow-y-auto bg-white dark:bg-gray-800/90 backdrop-blur-sm
                                                       border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white
                                                       rounded-xl shadow-xl">
                                    <SelectGroup>
                                      <SelectLabel className="text-xs text-gray-500 dark:text-gray-400">Market Categories</SelectLabel>
                                      <SelectItem value="equities" className="hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:bg-blue-50 dark:focus:bg-blue-900/20">
                                        <div className="flex items-center py-1">
                                          <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-full mr-2">
                                            <DollarSign size={16} className="text-green-600 dark:text-green-400" />
                                          </div>
                                          <span>Equities (Stocks)</span>
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="crypto" className="hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:bg-blue-50 dark:focus:bg-blue-900/20">
                                        <div className="flex items-center py-1">
                                          <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-full mr-2">
                                            <Bitcoin size={16} className="text-orange-600 dark:text-orange-400" />
                                          </div>
                                          <span>Cryptocurrency</span>
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="commodities" className="hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:bg-blue-50 dark:focus:bg-blue-900/20">
                                        <div className="flex items-center py-1">
                                          <div className="p-1.5 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mr-2">
                                            <BarChart3 size={16} className="text-yellow-600 dark:text-yellow-400" />
                                          </div>
                                          <span>Commodities</span>
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="indices" className="hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:bg-blue-50 dark:focus:bg-blue-900/20">
                                        <div className="flex items-center py-1">
                                          <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-2">
                                            <TrendingUp size={16} className="text-blue-600 dark:text-blue-400" />
                                          </div>
                                          <span>Indices</span>
                                        </div>
                                      </SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>
                              {errors.category && (
                                <motion.p 
                                  initial={{ opacity: 0, y: -10 }} 
                                  animate={{ opacity: 1, y: 0 }}
                                  className="text-red-500 text-sm mt-2 flex items-center"
                                >
                                  <AlertCircle size={14} className="mr-1" /> {errors.category}
                                </motion.p>
                              )}
                            </motion.div>
                        
                            {/* Asset Picker */}
                            <div>
                              <label className="block text-gray-700 dark:text-white mb-2 font-medium">Asset*</label>
                              <Select 
                                onValueChange={(value) => handleChange('asset', value)}
                                value={formData.asset}
                                disabled={!formData.category || isLoadingAssets}
                              >
                                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 
                                                     text-gray-800 dark:text-white shadow-sm hover:shadow-md transition-all">
                                  <SelectValue placeholder={formData.category ? "Select asset" : "Select category first"} />
                                </SelectTrigger>
                                <SelectContent className="max-h-60 overflow-y-auto bg-white dark:bg-gray-800 
                                                     border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">
                                  {isLoadingAssets ? (
                                    <SelectItem value="loading" disabled>
                                      <div className="flex items-center">
                                        <span className="mr-2">⏳</span>
                                        Loading assets...
                                      </div>
                                    </SelectItem>
                                  ) : !formData.category ? (
                                    <SelectItem value="select-category" disabled>
                                      Please select a category first
                                    </SelectItem>
                                  ) : assetOptions.length > 0 ? (
                                    assetOptions.map(asset => (
                                      <SelectItem key={asset.value} value={asset.value}>
                                        <div className="flex items-center">
                                          <span className="text-gray-400 mr-2">•</span>
                                          {asset.label}
                                        </div>
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="no-assets" disabled>
                                      No assets found for this category
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                              {errors.asset && <p className="text-red-500 text-sm mt-1">{errors.asset}</p>}
                            </div>
                            
                            {/* Prediction Type */}
                            <div>
                              <label className="block text-white mb-2">Prediction Type*</label>
                              <div className="grid grid-cols-3 gap-2">
                                <Button 
                                  type="button"
                                  variant={formData.predictionType === 'priceTarget' ? 'default' : 'outline'}
                                  className={formData.predictionType === 'priceTarget' ? 'bg-cyan-800 hover:bg-cyan-700' : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-white'}
                                  onClick={() => handleChange('predictionType', 'priceTarget')}
                                >
                                  Will reach price X
                                </Button>
                                <Button 
                                  type="button"
                                  variant={formData.predictionType === 'percentage' ? 'default' : 'outline'}
                                  className={formData.predictionType === 'percentage' ? 'bg-cyan-800 hover:bg-cyan-700' : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-white'}
                                  onClick={() => handleChange('predictionType', 'percentage')}
                                >
                                  % change
                                </Button>
                                <Button 
                                  type="button"
                                  variant={formData.predictionType === 'event' ? 'default' : 'outline'}
                                  className={formData.predictionType === 'event' ? 'bg-cyan-800 hover:bg-cyan-700' : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-white'}
                                  onClick={() => handleChange('predictionType', 'event')}
                                >
                                  Event
                                </Button>
                              </div>
                            </div>
                            
                            {/* Target Input */}
                            <div>
                              <label className="block text-white mb-2">
                                {formData.predictionType === 'priceTarget' && 'Target Price*'}
                                {formData.predictionType === 'percentage' && 'Percentage Change*'}
                                {formData.predictionType === 'event' && 'Event Description*'}
                              </label>
                              <Input 
                                className="bg-gray-800 border-gray-700 text-white"
                                placeholder={
                                  formData.predictionType === 'priceTarget' ? 'Enter target price' :
                                  formData.predictionType === 'percentage' ? 'Enter % (e.g. 5.2%)' :
                                  'Describe the event'
                                }
                                value={formData.targetPrice}
                                onChange={(e) => {
                                  // Validate input based on prediction type
                                  if (formData.predictionType === 'priceTarget') {
                                    // Allow only numbers and decimal points
                                    const value = e.target.value.replace(/[^0-9.]/g, '');
                                    handleChange('targetPrice', value);
                                  } else if (formData.predictionType === 'percentage') {
                                    // Allow numbers, decimal points, and % sign
                                    const value = e.target.value.replace(/[^0-9.%-]/g, '');
                                    handleChange('targetPrice', value);
                                  } else {
                                    // For event type, allow any text
                                    handleChange('targetPrice', e.target.value);
                                  }
                                }}
                              />
                              {errors.targetPrice && <p className="text-red-500 text-sm mt-1">{errors.targetPrice}</p>}
                            </div>
                            
                            {/* Deadline */}
                            <div>
                              <label className="block text-white mb-2">Target Deadline*</label>
                              <div className="flex items-center">
                                <Input 
                                  type="date" 
                                  className="bg-gray-800 border-gray-700 text-white"
                                  value={formData.deadline}
                                  onChange={(e) => handleChange('deadline', e.target.value)}
                                />
                                <Calendar className="ml-2 text-gray-400" size={20} />
                              </div>
                              {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
                            </div>
                            
                            {/* Confidence Slider */}
                            <div>
                              <label className="block text-white mb-2">Your Confidence Level</label>
                              <div className="flex items-center space-x-2">
                                <Slider 
                                  min={1}
                                  max={5}
                                  step={1}
                                  value={[formData.confidence]}
                                  onValueChange={(value) => handleChange('confidence', value[0])}
                                  className="py-4"
                                />
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star} 
                                      size={20} 
                                      className={star <= formData.confidence ? getConfidenceColor(formData.confidence) : 'text-gray-600'} 
                                      fill={star <= formData.confidence ? 'currentColor' : 'none'}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-500 text-sm mt-1">
                                How confident are you in this prediction?
                              </p>
                            </div>
                            
                            <div className="flex justify-end">
                              <Button 
                                type="button" 
                                onClick={() => handleTabChange('reasoning')}
                                className="bg-cyan-600 hover:bg-cyan-500"
                              >
                                Next: Add Reasoning
                              </Button>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </TabsContent>
                      
                      <TabsContent value="reasoning" className="space-y-6">
                        {/* Reasoning Field */}
                        <div>
                          <label className="block text-gray-700 dark:text-white mb-2 font-medium">Your Reasoning*</label>
                          <Textarea 
                            placeholder="What's your reasoning or supporting analysis?"
                            className="min-h-40 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 
                                     text-gray-800 dark:text-white resize-y shadow-sm hover:shadow-md transition-all"
                            value={formData.reasoning}
                            onChange={(e) => handleChange('reasoning', e.target.value)}
                          />
                          {errors.reasoning && <p className="text-red-500 text-sm mt-1">{errors.reasoning}</p>}
                          <p className="text-gray-500 text-sm mt-1">
                            Provide detailed analysis to support your prediction
                          </p>
                          
                          {/* Reasoning Validation Results */}
                          {reasoningValidation && (
                            <div className="mt-4 p-3 bg-gray-800/50 rounded-md border border-gray-700">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="text-white font-medium">Reasoning Validation</h4>
                                <Badge className={reasoningValidation.score >= 70 ? "bg-green-600/30 text-green-400" : "bg-red-600/30 text-red-400"}>
                                  Score: {reasoningValidation.score}%
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-300 mb-2">{reasoningValidation.message}</p>
                              <details className="text-xs text-gray-400">
                                <summary className="cursor-pointer hover:text-white">View detailed feedback</summary>
                                <p className="mt-2 p-2 bg-gray-800 rounded">{reasoningValidation.details}</p>
                              </details>
                            </div>
                          )}
                        </div>
                        
                        {/* File Upload Section */}
                        <div>
                          <label className="block text-gray-700 dark:text-white mb-2 font-medium">Supporting Documents</label>
                          <div className="flex flex-col space-y-4">
                            <div 
                              onClick={() => fileInputRef.current.click()}
                              className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 
                                       text-center cursor-pointer hover:border-blue-500 dark:hover:border-cyan-500 
                                       transition-colors bg-gray-50 dark:bg-gray-800/50"
                            >
                              <input 
                                type="file"
                                multiple
                                accept=".pdf,.docx,.png,.jpg,.jpeg,.txt"
                                onChange={handleFileUpload}
                                ref={fileInputRef}
                                className="hidden"
                              />
                              <Upload size={28} className="mx-auto mb-2 text-gray-500" />
                              <p className="text-gray-400">
                                Drag & drop or click to upload supporting documents
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Supports PDF, DOCX, PNG, JPG, TXT (Max 5MB each)
                              </p>
                            </div>
                            
                            {/* File Upload Progress */}
                            {isUploading && (
                              <div className="flex items-center justify-center p-2 bg-gray-800/60 rounded-md">
                                <Loader2 size={18} className="animate-spin mr-2 text-cyan-400" />
                                <span className="text-cyan-400 text-sm">Processing document...</span>
                              </div>
                            )}
                            
                            {/* Uploaded Files List */}
                            {uploadedFiles.length > 0 && (
                              <div className="space-y-3 mt-3">
                                <h4 className="text-white text-sm font-medium">Uploaded Documents</h4>
                                <div className="divide-y divide-gray-800">
                                  {uploadedFiles.map(file => (
                                    <div key={file.id} className="py-3 first:pt-0 last:pb-0">
                                      <div className="flex justify-between items-start">
                                        <div className="flex items-start">
                                          {file.type.includes('image') ? (
                                            <Image 
                                              src={file.preview} 
                                              alt={file.name} 
                                              width={40}
                                              height={40}
                                              className="object-cover rounded mr-3"
                                            />
                                          ) : (
                                            <FileText size={24} className="text-gray-400 mr-3" />
                                          )}
                                          <div>
                                            <p className="text-white text-sm truncate max-w-[200px]">{file.name}</p>
                                            <p className="text-gray-500 text-xs">{(file.size / 1024).toFixed(1)} KB</p>
                                          </div>
                                        </div>
                                        <button 
                                          type="button"
                                          onClick={() => removeFile(file.id)}
                                          className="text-gray-500 hover:text-red-400"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      </div>
                                      
                                      {/* Document Validation Status */}
                                      {fileValidations[file.id] && (
                                        <div className="mt-2 ml-10 p-2 bg-gray-800/60 rounded text-xs">
                                          <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center">
                                              {fileValidations[file.id].trustLevel === 'trusted' ? (
                                                <Shield className="h-3 w-3 text-green-400 mr-1" />
                                              ) : fileValidations[file.id].trustLevel === 'unverified' ? (
                                                <Shield className="h-3 w-3 text-yellow-400 mr-1" />
                                              ) : (
                                                <Shield className="h-3 w-3 text-red-400 mr-1" />
                                              )}
                                              <span className={
                                                fileValidations[file.id].trustLevel === 'trusted' ? 'text-green-400' :
                                                fileValidations[file.id].trustLevel === 'unverified' ? 'text-yellow-400' :
                                                'text-red-400'
                                              }>
                                                {fileValidations[file.id].trustLevel === 'trusted' ? 'Trusted Source' :
                                                 fileValidations[file.id].trustLevel === 'unverified' ? 'Unverified Source' :
                                                 'Low Quality Source'}
                                              </span>
                                            </div>
                                            <span className="text-gray-400">
                                              Score: {fileValidations[file.id].score || 0}%
                                            </span>
                                          </div>
                                          {fileValidations[file.id].summary && (
                                            <p className="text-gray-300 text-xs mt-1">{fileValidations[file.id].summary}</p>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4">
                          {uploadedFiles.map(file => (
                            <div key={file.id} className="flex items-center bg-gray-800 border border-gray-700 rounded-md p-2">
                              <FileText className="text-gray-400 mr-2" />
                              <span className="text-white text-sm flex-1">{file.name}</span>
                              <Button 
                                variant="outline" 
                                onClick={() => removeFile(file.id)}
                                className="text-gray-400 hover:text-white"
                              >
                                <X size={16} />
                              </Button>
                            </div>
                          ))}
                          <div className="flex items-center bg-gray-800 border border-gray-700 rounded-md p-2 cursor-pointer" onClick={() => fileInputRef.current.click()}>
                            <Upload className="text-gray-400 mr-2" />
                            <span className="text-white text-sm">Upload Files</span>
                          </div>
                        </div>
                        <p className="text-gray-500 text-sm mt-1">
                          Upload any relevant documents (PDF, DOCX, PNG, JPG, TXT) to support your prediction
                        </p>

                        <div className="flex justify-between">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => handleTabChange('setup')}
                            className="border-gray-700 text-white"
                          >
                            Back
                          </Button>
                          
                          <div className="flex gap-3">
                            <Button 
                              type="button" 
                              onClick={() => handleTabChange('preview')}
                              className="bg-green-600 hover:bg-green-500 text-white font-bold"
                            >
                              <span className="flex items-center">
                                <CheckCircle size={18} className="mr-2" /> Continue to Preview
                              </span>
                            </Button>
                            
                            <Button 
                              type="button" 
                              onClick={validatePrediction}
                              className="bg-cyan-600 hover:bg-cyan-500"
                              disabled={isValidating}
                            >
                              {isValidating ? (
                                <span className="flex items-center">
                                  <Loader2 size={18} className="animate-spin mr-2" /> Validating...
                                </span>
                              ) : (
                                <span className="flex items-center">
                                  <Shield size={18} className="mr-2" /> Validate Prediction
                                </span>
                              )}
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    
                      <TabsContent value="preview" className="space-y-6">
                        <Alert className={`border-amber-500/20 ${theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-50'} ${theme === 'dark' ? 'border-amber-500/20' : 'border-amber-200'}`}>
                          <AlertCircle className={`h-4 w-4 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`} />
                          <AlertTitle className={`${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>Preview</AlertTitle>
                          <AlertDescription className={`${theme === 'dark' ? 'text-amber-200' : 'text-amber-600'}`}>
                            Review your prediction before submitting to your DAO community.
                          </AlertDescription>
                        </Alert>
                      
                        {/* Summary of prediction details */}
                        <div className={`space-y-4 ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-100'} rounded-md p-4`}>
                          <h3 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-medium`}>Prediction Summary</h3>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Category:</span>
                              <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{
                                formData.category === 'equities' ? 'Equities' : 
                                formData.category === 'crypto' ? 'Crypto' : 
                                formData.category === 'commodities' ? 'Commodities' : 
                                formData.category === 'indices' ? 'Indices' : 
                                'Not selected'
                              }</p>
                            </div>
                            <div>
                              <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Asset:</span>
                              <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{formData.asset || 'Not selected'}</p>
                            </div>
                            <div>
                              <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Prediction:</span>
                              <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {formData.predictionType === 'priceTarget' && `Will reach ${formData.targetPrice || 'X'}`}
                                {formData.predictionType === 'percentage' && `Will change by ${formData.targetPrice || 'X%'}`}
                                {formData.predictionType === 'event' && `Will ${formData.targetPrice || 'event'}`}
                              </p>
                            </div>
                            <div>
                              <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>By:</span>
                              <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{formData.deadline || 'No deadline set'}</p>
                            </div>
                            <div>
                              <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Confidence:</span>
                              <p className={getConfidenceColor(formData.confidence)}>
                                {formData.confidence}/5
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => handleTabChange('reasoning')}
                            className={`${theme === 'dark' ? 'border-gray-700 text-white hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                          >
                            Back
                          </Button>
                          <Button 
                            type="button" 
                            onClick={() => handleTabChange('submit')}
                            className="bg-cyan-600 hover:bg-cyan-500"
                          >
                            Next: Submit
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="submit" className="space-y-6">
                        {/* Confirmation */}
                        <Alert className={`border-cyan-500/20 ${theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-50'} ${theme === 'dark' ? 'border-cyan-500/20' : 'border-cyan-200'}`}>
                          <AlertCircle className={`h-4 w-4 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
                          <AlertTitle className={`${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`}>Almost there!</AlertTitle>
                          <AlertDescription className={`${theme === 'dark' ? 'text-cyan-200' : 'text-cyan-600'}`}>
                            Your prediction will be submitted to the blockchain and shared with your DAO community.
                          </AlertDescription>
                        </Alert>
                        
                        {validationError && (
                          <Alert className={`border-red-500/20 ${theme === 'dark' ? 'bg-red-500/10' : 'bg-red-50'} ${theme === 'dark' ? 'border-red-500/20' : 'border-red-200'} mb-4`}>
                            <AlertCircle className={`h-4 w-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
                            <AlertTitle className={`${theme === 'dark' ? 'text-red-400' : 'text-red-700'}`}>Validation Error</AlertTitle>
                            <AlertDescription className={`${theme === 'dark' ? 'text-red-200' : 'text-red-600'}`}>
                              {validationError}
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        {validationPercentage > 0 && (
                          <Alert className={`border-blue-500/20 ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'} ${theme === 'dark' ? 'border-blue-500/20' : 'border-blue-200'} mb-4`}>
                            <CheckCircle className={`h-4 w-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                            <AlertTitle className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>Validation Score: {validationPercentage}%</AlertTitle>
                            <AlertDescription className={`${theme === 'dark' ? 'text-blue-200' : 'text-blue-600'}`}>
                              Your prediction has been analyzed. You can proceed to submit.
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        <div className={`flex flex-row items-start space-x-3 space-y-0 rounded-md border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} p-4`}>
                          <Checkbox
                            checked={formData.confirmed}
                            onCheckedChange={(checked) => handleChange('confirmed', checked)}
                            className="data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                          />
                          <div className="space-y-1 leading-none">
                            <label className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              I confirm this prediction is clear, verifiable, and backed with reasoning
                            </label>
                            <p className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'} text-sm`}>
                              By submitting, this prediction will be reviewed by your DAO community
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setActiveTab('preview')}
                            className={`${theme === 'dark' ? 'border-gray-700 text-white hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                          >
                            Back
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={!formData.confirmed}
                            className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
                          >
                            Submit to DAO Community
                          </Button>
                        </div>
                        <div className="flex justify-center mt-4">
                          <Button 
                            type="button" 
                            onClick={handleContinueToCommunityHub}
                            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
                          >
                            Continue to Community Hub
                          </Button>
                        </div>
                      </TabsContent>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* RIGHT SECTION: Validation Result & Preview */}
              <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
                {/* Validation Result Card */}
                <Card className={`${theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200'} shadow-lg overflow-hidden`}>
                  <CardHeader className={`${theme === 'dark' ? 'bg-gray-800/50 border-b border-gray-800/50' : 'bg-gray-50 border-b border-gray-200'}`}>
                    <CardTitle className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'} flex items-center`}>
                      <CheckCircle size={18} className={`mr-2 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
                      Validation Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    {isValidating ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="w-12 h-12 border-4 border-cyan-600/30 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
                        <p className={`${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-600'}`}>Analyzing prediction...</p>
                      </div>
                    ) : validationPercentage > 0 ? (
                      <div className="space-y-4">
                        <div className={`relative h-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                          <div 
                            className={`absolute top-0 left-0 h-full rounded-full ${
                              validationPercentage >= 30 ? 'bg-green-500' : 
                              validationPercentage >= 15 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${validationPercentage}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Score:</span>
                          <span className={`font-medium ${
                            validationPercentage >= 30 ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : 
                            validationPercentage >= 15 ? (theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600') : 
                            (theme === 'dark' ? 'text-red-400' : 'text-red-600')
                          }`}>{validationPercentage}%</span>
                        </div>
                        
                        {validationError ? (
                          <Alert className={`border-red-500/20 ${theme === 'dark' ? 'bg-red-500/10' : 'bg-red-50'} ${theme === 'dark' ? 'border-red-500/20' : 'border-red-200'}`}>
                            <AlertCircle className={`h-4 w-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
                            <AlertTitle className={`${theme === 'dark' ? 'text-red-400' : 'text-red-700'}`}>Validation Failed</AlertTitle>
                            <AlertDescription className={`${theme === 'dark' ? 'text-red-200' : 'text-red-600'} text-sm`}>
                              {validationError}
                            </AlertDescription>
                          </Alert>
                        ) : (
                          <Alert className={`border-green-500/20 ${theme === 'dark' ? 'bg-green-500/10' : 'bg-green-50'} ${theme === 'dark' ? 'border-green-500/20' : 'border-green-200'}`}>
                            <CheckCircle className={`h-4 w-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                            <AlertTitle className={`${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>Prediction Validated</AlertTitle>
                            <AlertDescription className={`${theme === 'dark' ? 'text-green-200' : 'text-green-600'} text-sm`}>
                              Your prediction is well-supported by data and reasoning.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    ) : (
                      <div className={`py-6 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        <p>Submit your reasoning to get validation results</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Live Preview */}
                <div className={`${theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'} rounded-lg p-4 border shadow-lg`}>
                  <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>Live Preview</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>This is how your prediction will appear after approval</p>
                </div>
                
                <Card className={`${theme === 'dark' ? 'bg-gray-900/50 border-gray-800 hover:shadow-cyan-900/20' : 'bg-white border-gray-200 hover:shadow-gray-200'} shadow-2xl backdrop-blur-sm overflow-hidden transition-all duration-300`}>
                  <div className="absolute top-0 right-0 bg-amber-500/20 text-amber-300 text-xs py-1 px-3 rounded-bl-lg">
                    Pending DAO Review
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center text-white font-bold">
                          {formData.community?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                      </div>
                      <Badge className="bg-cyan-900/50 text-cyan-400 hover:bg-cyan-800/50">
                        {formData.category ? 
                          formData.category === 'equities' ? 'Equities' : 
                          formData.category === 'crypto' ? 'Crypto' : 
                          formData.category === 'commodities' ? 'Commodities' : 
                          formData.category === 'indices' ? 'Indices' : 
                          formData.category : 'Category'}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} flex items-center`}>
                          {formData.asset ? formData.asset : 'Asset'} 
                          {formData.predictionType === 'priceTarget' && 
                            <span className={`ml-2 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>will reach {formData.targetPrice || 'X'}</span>
                          }
                          {formData.predictionType === 'percentage' && 
                            <span className={`ml-2 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>will change by {formData.targetPrice || 'X%'}</span>
                          }
                          {formData.predictionType === 'event' && 
                            <span className={`ml-2 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>will {formData.targetPrice || 'event'}</span>
                          }
                        </h3>
                        
                        <div className="mt-2 flex gap-2">
                          {formData.deadline && (
                            <Badge variant="outline" className={`${theme === 'dark' ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-600'}`}>
                              <Calendar size={12} className="mr-1" />
                              By {formData.deadline}
                            </Badge>
                          )}
                          {formData.confidence && (
                            <Badge variant="outline" className={`${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} ${getConfidenceColor(formData.confidence)}`}>
                              <div className="flex items-center">
                                {[...Array(formData.confidence)].map((_, i) => (
                                  <Star key={i} size={12} fill="currentColor" className="mr-0.5" />
                                ))}
                                <span className="ml-1">Confidence</span>
                              </div>
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className={`${theme === 'dark' ? 'bg-gray-800/50 text-gray-300' : 'bg-gray-100 text-gray-700'} rounded-md p-3 text-sm`}>
                        {formData.reasoning || "Your reasoning will appear here..."}
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className={`border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} pt-3`}>
                    <div className={`flex justify-between items-center w-full text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <Share2 size={14} className="mr-1" />
                          Share
                        </div>
                        {formData.predictionType === 'priceTarget' && (
                          <Badge className={`${theme === 'dark' ? 'bg-gray-800/80 text-gray-400 hover:bg-gray-700' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>Short-term</Badge>
                        )}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
                
                {/* Mobile Submit Button (Visible on small screens) */}
                <div className="lg:hidden fixed bottom-4 right-4 left-4 z-10">
                  <Button 
                    type="button" 
                    onClick={() => validatePrediction()}
                    className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 shadow-lg"
                  >
                    Validate Prediction
                  </Button>
                </div>
              </div>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </>
  );
};

export default CreatePredictionPage;