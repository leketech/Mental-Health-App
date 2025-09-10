import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Billing = () => {
  const { classes } = useTheme();
  const [activeTab, setActiveTab] = useState('subscription');
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [billingCycle, setBillingCycle] = useState('monthly');

  const subscriptionPlans = [
    {
      id: 'basic',
      name: 'Basic',
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      features: [
        'Mood tracking',
        'Basic journal entries',
        'Weekly AI insights',
        'Email support'
      ],
      color: 'bg-gray-100 text-gray-900',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
      features: [
        'Everything in Basic',
        'Unlimited journal entries',
        'Daily AI insights',
        'Chat with AI assistant',
        'Priority support',
        'Advanced analytics'
      ],
      color: 'bg-blue-600 text-white',
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      monthlyPrice: 39.99,
      yearlyPrice: 399.99,
      features: [
        'Everything in Pro',
        'Therapy session booking',
        'Video consultations',
        'Personalized treatment plans',
        '24/7 crisis support',
        'Family sharing (up to 4 members)'
      ],
      color: 'bg-purple-600 text-white',
      popular: false
    }
  ];

  const paymentMethods = [
    {
      id: 1,
      type: 'Visa',
      last4: '4242',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: 2,
      type: 'Mastercard',
      last4: '8888',
      expiry: '08/26',
      isDefault: false
    }
  ];

  const billingHistory = [
    {
      id: 1,
      date: '2024-07-01',
      description: 'Pro Plan - Monthly',
      amount: 19.99,
      status: 'Paid',
      invoice: 'INV-2024-001'
    },
    {
      id: 2,
      date: '2024-06-01',
      description: 'Pro Plan - Monthly',
      amount: 19.99,
      status: 'Paid',
      invoice: 'INV-2024-002'
    },
    {
      id: 3,
      date: '2024-05-01',
      description: 'Basic Plan - Monthly',
      amount: 9.99,
      status: 'Paid',
      invoice: 'INV-2024-003'
    }
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handleUpgrade = () => {
    const plan = subscriptionPlans.find(p => p.id === selectedPlan);
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
    alert(`Upgrading to ${plan.name} plan (${billingCycle}) for $${price}${billingCycle === 'monthly' ? '/month' : '/year'}`);
  };

  const getCurrentPlan = () => {
    return subscriptionPlans.find(p => p.id === 'pro'); // Assuming user is on Pro plan
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group-[:not(.bw-theme)]/bw-theme:bg-white group-bw-theme/bw-theme:bg-white overflow-x-hidden" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
      <div className="max-w-7xl mx-auto px-10 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-[var(--text-primary)] text-4xl font-bold leading-tight tracking-tighter mb-4">Billing & Subscription</h1>
          <p className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-[var(--text-secondary)] text-lg font-normal leading-normal">Manage your subscription, payment methods, and billing history</p>
        </div>

        {/* Tabs */}
        <div className="mb-10">
          <div className="border-b border-solid group-[:not(.bw-theme)]/bw-theme:border-b-slate-200 group-bw-theme/bw-theme:border-b-gray-300">
            <nav className="flex space-x-8">
              {[
                { id: 'subscription', name: 'Subscription', icon: 'subscriptions' },
                { id: 'payment', name: 'Payment Methods', icon: 'credit_card' },
                { id: 'history', name: 'Billing History', icon: 'receipt' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-base flex items-center gap-3 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 group-[:not(.bw-theme)]/bw-theme:border-blue-600 group-bw-theme/bw-theme:border-[var(--primary-color)] text-blue-600 group-[:not(.bw-theme)]/bw-theme:text-blue-600 group-bw-theme/bw-theme:text-[var(--primary-color)]'
                      : 'border-transparent text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-[var(--text-secondary)] hover:text-slate-900 group-[:not(.bw-theme)]/bw-theme:hover:text-slate-900 group-bw-theme/bw-theme:hover:text-[var(--text-primary)] hover:border-slate-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <div className="space-y-8">
            {/* Current Plan */}
            <div className="bg-white group-[:not(.bw-theme)]/bw-theme:bg-white group-bw-theme/bw-theme:bg-white rounded-lg shadow-sm border border-solid group-[:not(.bw-theme)]/bw-theme:border-slate-200 group-bw-theme/bw-theme:border-gray-300 p-8">
              <h2 className="text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-[var(--text-primary)] text-2xl font-bold leading-tight tracking-tight mb-6">Current Plan</h2>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-[var(--text-primary)] text-xl font-bold leading-tight">{getCurrentPlan().name} Plan</h3>
                  <p className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-[var(--text-secondary)] text-base font-normal leading-normal mt-2">
                    ${getCurrentPlan().monthlyPrice}/month • Renews on August 1, 2024
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                  <button className="text-blue-600 group-[:not(.bw-theme)]/bw-theme:text-blue-600 group-bw-theme/bw-theme:text-[var(--primary-color)] hover:text-blue-700 text-base font-medium transition-colors">
                    Cancel Subscription
                  </button>
                </div>
              </div>
            </div>

            {/* Billing Cycle Toggle */}
            <div className="flex items-center justify-center">
              <div className="bg-slate-50 group-[:not(.bw-theme)]/bw-theme:bg-slate-50 group-bw-theme/bw-theme:bg-gray-100 p-1.5 rounded-lg flex">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-3 rounded-md text-base font-medium transition-colors ${
                    billingCycle === 'monthly'
                      ? 'bg-white group-[:not(.bw-theme)]/bw-theme:bg-white group-bw-theme/bw-theme:bg-white text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-[var(--text-primary)] shadow-sm'
                      : 'text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-[var(--text-secondary)] hover:text-slate-900 group-[:not(.bw-theme)]/bw-theme:hover:text-slate-900 group-bw-theme/bw-theme:hover:text-[var(--text-primary)]'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-6 py-3 rounded-md text-base font-medium transition-colors ${
                    billingCycle === 'yearly'
                      ? 'bg-white group-[:not(.bw-theme)]/bw-theme:bg-white group-bw-theme/bw-theme:bg-white text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-[var(--text-primary)] shadow-sm'
                      : 'text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-[var(--text-secondary)] hover:text-slate-900 group-[:not(.bw-theme)]/bw-theme:hover:text-slate-900 group-bw-theme/bw-theme:hover:text-[var(--text-primary)]'
                  }`}
                >
                  Yearly
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Save 17%
                  </span>
                </button>
              </div>
            </div>

            {/* Subscription Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative rounded-lg border-2 p-8 cursor-pointer transition-all ${
                    selectedPlan === plan.id
                      ? 'border-blue-600 group-[:not(.bw-theme)]/bw-theme:border-blue-600 group-bw-theme/bw-theme:border-[var(--primary-color)] ring-2 ring-blue-200 group-[:not(.bw-theme)]/bw-theme:ring-blue-200 group-bw-theme/bw-theme:ring-gray-300'
                      : 'border-slate-200 group-[:not(.bw-theme)]/bw-theme:border-slate-200 group-bw-theme/bw-theme:border-gray-300 hover:border-slate-300 group-[:not(.bw-theme)]/bw-theme:hover:border-slate-300 group-bw-theme/bw-theme:hover:border-gray-400'
                  } ${plan.popular ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-[var(--text-primary)] text-2xl font-bold leading-tight tracking-tight mb-4">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-[var(--text-primary)] text-4xl font-bold leading-tight">
                        ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                      </span>
                      <span className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-[var(--text-secondary)] text-lg font-normal ml-1">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                    <ul className="space-y-4 mb-8 text-left">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="material-symbols-outlined text-green-500 text-xl mr-3 mt-0.5">
                            check_circle
                          </span>
                          <span className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-[var(--text-secondary)] text-base font-normal leading-normal">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Upgrade Button */}
            <div className="text-center">
              <button
                onClick={handleUpgrade}
                className="flex min-w-[140px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-8 bg-blue-600 group-[:not(.bw-theme)]/bw-theme:bg-blue-600 group-bw-theme/bw-theme:bg-[var(--primary-color)] text-white text-lg font-bold leading-normal tracking-wide hover:bg-blue-700 group-[:not(.bw-theme)]/bw-theme:hover:bg-blue-700 group-bw-theme/bw-theme:hover:bg-black/80 transition-colors"
              >
                <span className="truncate">{selectedPlan === getCurrentPlan().id ? 'Current Plan' : 'Upgrade Plan'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Payment Methods Tab */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            <div className="bg-white group-[:not(.bw-theme)]/bw-theme:bg-white group-bw-theme/bw-theme:bg-white rounded-lg shadow-sm border border-solid group-[:not(.bw-theme)]/bw-theme:border-slate-200 group-bw-theme/bw-theme:border-gray-300 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-[var(--text-primary)] text-2xl font-bold leading-tight tracking-tight">Payment Methods</h2>
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-11 px-5 bg-blue-600 group-[:not(.bw-theme)]/bw-theme:bg-blue-600 group-bw-theme/bw-theme:bg-[var(--primary-color)] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 group-[:not(.bw-theme)]/bw-theme:hover:bg-blue-700 group-bw-theme/bw-theme:hover:bg-black/80 transition-colors">
                  <span className="truncate">Add Payment Method</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-6 border border-solid group-[:not(.bw-theme)]/bw-theme:border-slate-200 group-bw-theme/bw-theme:border-gray-300 rounded-lg">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-10 bg-slate-50 group-[:not(.bw-theme)]/bw-theme:bg-slate-50 group-bw-theme/bw-theme:bg-gray-100 rounded flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-[var(--text-secondary)]">credit_card</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-[var(--text-primary)] text-base leading-tight">
                          {method.type} ending in {method.last4}
                        </p>
                        <p className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-[var(--text-secondary)] text-base font-normal leading-normal mt-1">Expires {method.expiry}</p>
                      </div>
                      {method.isDefault && (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      {!method.isDefault && (
                        <button className="text-blue-600 group-[:not(.bw-theme)]/bw-theme:text-blue-600 group-bw-theme/bw-theme:text-[var(--primary-color)] hover:text-blue-700 text-base font-medium transition-colors">
                          Set as Default
                        </button>
                      )}
                      <button className="text-red-600 hover:text-red-700 text-base font-medium transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Billing History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">Billing History</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Invoice
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {billingHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {new Date(item.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {item.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          ${item.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.status === 'Paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-blue-600 hover:text-blue-700 font-medium">
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Billing;