import { useState, useEffect } from 'react';
import { Menu, X, Scale, Users, FileText, Shield, Phone, Mail, MapPin, Clock, CheckCircle, Award, ArrowRight, Calendar, MessageCircle, ChevronRight, Building, Gavel, UserCheck } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAcceptDisclaimer = () => {
    setShowDisclaimer(false);
  };

  const services = [
    {
      icon: <Scale className="w-8 h-8 text-amber-600" />,
      title: "Civil Litigation",
      description: "Expert representation in civil disputes, property matters, and commercial litigation with a track record of successful outcomes.",
      features: ["Property Disputes", "Contract Violations", "Commercial Litigation", "Tort Claims"]
    },
    {
      icon: <Building className="w-8 h-8 text-amber-600" />,
      title: "Corporate Law",
      description: "Comprehensive corporate legal services including business formation, contracts, compliance, and corporate governance.",
      features: ["Business Formation", "Corporate Compliance", "Mergers & Acquisitions", "Contract Drafting"]
    },
    {
      icon: <FileText className="w-8 h-8 text-amber-600" />,
      title: "Legal Documentation",
      description: "Professional drafting and review of legal documents, agreements, contracts, and legal correspondence.",
      features: ["Contract Review", "Legal Agreements", "Documentation", "Legal Research"]
    },
    {
      icon: <Shield className="w-8 h-8 text-amber-600" />,
      title: "Legal Consultation",
      description: "Strategic legal advice and consultation for individuals and businesses on various legal matters and compliance issues.",
      features: ["Strategic Planning", "Risk Assessment", "Compliance Review", "Legal Advisory"]
    }
  ];

  const practiceAreas = [
    "Civil & Commercial Litigation",
    "Corporate & Business Law",
    "Property & Real Estate Law",
    "Contract Law & Agreements",
    "Family Law Matters",
    "Consumer Protection",
    "Banking & Finance Law",
    "Labor & Employment Law"
  ];

  const achievements = [
    {
      icon: <Award className="w-8 h-8 text-amber-600" />,
      number: "7+",
      label: "Years Experience",
      description: "Decade of legal expertise"
    },
    {
      icon: <Users className="w-8 h-8 text-amber-600" />,
      number: "High",
      label: "Professional Standard",
      description: "Satisfied clients nationwide"
    },
    {
      icon: <Award className="w-8 h-8 text-amber-600" />,
      number: "Multiple",
      label: "Areas of Expertise",
      description: "Multiple Specializations"
    },
    {
      icon: <Scale className="w-8 h-8 text-amber-600" />,
      number: "Ethics",
      label: "First",
      description: "Professional integrity"
    }
  ];


  const credentials = [
    "LLB from Banaras Hindu University",
    "Member of State Bar Council",
    "Real Estate Law Specialization",
    "Corporate Law Specialization"
  ];


  return (
    <div className="min-h-screen bg-white">
      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 flex items-center">
              <Scale className="w-8 h-8 text-amber-500 mr-3" />
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">DISCLAIMER</h2>
                <p className="text-amber-400 text-sm">Bar Council of India Rules</p>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 text-gray-700">
              <p className="text-slate-800 leading-relaxed">
                As per the rules of the Bar Council of India, Advocates are not permitted to solicit work or advertise, either directly or indirectly. By accessing this website, the user acknowledges that:
              </p>

              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 border-l-4 border-amber-500">
                  <h3 className="font-semibold text-slate-900 mb-2 flex items-center">
                    <span className="bg-amber-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center mr-2">1</span>
                    No Advertisement or Solicitation
                  </h3>
                  <p className="text-sm text-gray-600 ml-8">
                    The contents of this website are for informational and knowledge-sharing purposes only and do not constitute any form of advertisement, solicitation, or inducement of any nature whatsoever.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border-l-4 border-amber-500">
                  <h3 className="font-semibold text-slate-900 mb-2 flex items-center">
                    <span className="bg-amber-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center mr-2">2</span>
                    No Legal Advice
                  </h3>
                  <p className="text-sm text-gray-600 ml-8">
                    The information provided is not intended to be legal advice. Visitors are advised not to act or refrain from acting on the basis of any content without seeking appropriate legal advice from a qualified professional.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border-l-4 border-amber-500">
                  <h3 className="font-semibold text-slate-900 mb-2 flex items-center">
                    <span className="bg-amber-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center mr-2">3</span>
                    No Attorney–Client Relationship
                  </h3>
                  <p className="text-sm text-gray-600 ml-8">
                    Accessing, browsing, or using this website does not create an Advocate–Client relationship between the visitor and the Advocate.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border-l-4 border-amber-500">
                  <h3 className="font-semibold text-slate-900 mb-2 flex items-center">
                    <span className="bg-amber-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center mr-2">4</span>
                    User-Initiated Access
                  </h3>
                  <p className="text-sm text-gray-600 ml-8">
                    The user confirms that they are accessing this website on their own initiative for gaining knowledge and information about the law.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border-l-4 border-amber-500">
                  <h3 className="font-semibold text-slate-900 mb-2 flex items-center">
                    <span className="bg-amber-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center mr-2">5</span>
                    Accuracy and Completeness
                  </h3>
                  <p className="text-sm text-gray-600 ml-8">
                    While reasonable efforts are made to ensure accuracy, the Advocate makes no warranties about the accuracy, completeness, or reliability of the content.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border-l-4 border-amber-500">
                  <h3 className="font-semibold text-slate-900 mb-2 flex items-center">
                    <span className="bg-amber-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center mr-2">6</span>
                    Limitation of Liability
                  </h3>
                  <p className="text-sm text-gray-600 ml-8">
                    The Advocate shall not be liable for any loss, damage, or injury arising from the use of or reliance upon the information provided on this website.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border-l-4 border-amber-500">
                  <h3 className="font-semibold text-slate-900 mb-2 flex items-center">
                    <span className="bg-amber-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center mr-2">7</span>
                    Third-Party Links
                  </h3>
                  <p className="text-sm text-gray-600 ml-8">
                    This website may contain links to third-party websites. The Advocate does not endorse or assume responsibility for external content.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border-l-4 border-amber-500">
                  <h3 className="font-semibold text-slate-900 mb-2 flex items-center">
                    <span className="bg-amber-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center mr-2">8</span>
                    Intellectual Property
                  </h3>
                  <p className="text-sm text-gray-600 ml-8">
                    All content on this website is the intellectual property of the Advocate. Unauthorized use, reproduction, or distribution is prohibited.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border-l-4 border-amber-500">
                  <h3 className="font-semibold text-slate-900 mb-2 flex items-center">
                    <span className="bg-amber-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center mr-2">9</span>
                    Jurisdiction
                  </h3>
                  <p className="text-sm text-gray-600 ml-8">
                    This disclaimer shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of competent courts.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-4">
                By proceeding further, you acknowledge that you have read, understood, and agreed to this disclaimer.
              </p>
              <button
                onClick={handleAcceptDisclaimer}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                I Agree & Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
        ? 'bg-slate-900/95 backdrop-blur-md shadow-lg'
        : 'bg-slate-900'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Scale className="w-8 h-8 text-amber-500 mr-2" />
                <span className="text-xl font-bold text-white">Ashutosh Ojha</span>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#home" className="text-white hover:text-amber-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</a>
                <a href="#about" className="text-gray-300 hover:text-amber-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">About</a>
                {/* <a href="#services" className="text-gray-300 hover:text-amber-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Services</a> */}
                <a href="#practice" className="text-gray-300 hover:text-amber-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Practice Areas</a>
                <a href="#knowledge" className="text-gray-300 hover:text-amber-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Knowledge Corner</a>
                <a href="#contact" className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Contact</a>
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-amber-400 focus:outline-none focus:text-amber-400"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-900/95 backdrop-blur-md border-t border-slate-700">
              <a href="#home" className="text-white hover:text-amber-400 block px-3 py-2 rounded-md text-base font-medium">Home</a>
              <a href="#about" className="text-gray-300 hover:text-amber-400 block px-3 py-2 rounded-md text-base font-medium">About</a>
              <a href="#services" className="text-gray-300 hover:text-amber-400 block px-3 py-2 rounded-md text-base font-medium">Services</a>
              <a href="#practice" className="text-gray-300 hover:text-amber-400 block px-3 py-2 rounded-md text-base font-medium">Practice Areas</a>
              <a href="#contact" className="text-gray-300 hover:text-amber-400 block px-3 py-2 rounded-md text-base font-medium">Contact</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6">
                {/* <div className="inline-flex items-center bg-amber-600/20 text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Licensed Legal Professional
                </div> */}
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                  Ashutosh Ojha
                </h1>
                <p className="text-xl md:text-2xl mb-4 text-amber-400 font-semibold">
                  Advocate & Legal Consultant
                </p>
                <p className="text-lg md:text-xl mb-8 leading-relaxed text-gray-200 text-justify">
                  Legal professional with over seven years of experience in civil litigation, real estate litigation, corporate advisory, and legal documentation. Experienced in handling complex legal matters with a practical, solution-oriented approach.
                </p>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {achievements.map((achievement, index) => (
                  <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors">
                    <div className="flex justify-center mb-2">
                      {achievement.icon}
                    </div>
                    <div className="text-2xl font-bold text-amber-400">{achievement.number}</div>
                    <div className="text-sm text-gray-300">{achievement.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#contact"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Disclaimer
                </a>
                <a
                  href="#services"
                  className="border-2 border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center"
                >
                  Practice Areas
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img
                  src="/images/hero-portrait.jpg"
                  alt="Ashutosh Ojha - Professional Advocate"
                  className="rounded-2xl shadow-2xl w-full max-w-md mx-auto"
                />
                <div className="absolute -bottom-6 -right-6 bg-amber-600 text-white p-4 rounded-xl shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold">7+</div>
                    <div className="text-sm">Years Experience</div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/*++++++++++++++++++++++++++++++++++++++++ About Section +++++++++++++++++++++++++++++++++++++++*/}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="mb-8 lg:mb-0">
              <img
                src="/images/about-portrait.jpeg"
                alt="Ashutosh Ojha in Professional Setting"
                className="rounded-2xl shadow-xl w-full"
              />
            </div>

            <div>
              <div className="mb-6">
                <span className="inline-flex items-center bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  <Award className="w-4 h-4 mr-2" />
                  Professional Excellence
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                  About Ashutosh Ojha
                </h2>
              </div>

              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                With over 7 years of dedicated practice in law, I specialize in providing comprehensive
                legal services to individuals and businesses. My commitment to excellence and client-focused
                approach has established a reputation for delivering effective legal solutions with integrity
                and professionalism.
              </p>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Professional Credentials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {credentials.map((credential, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-amber-600 mr-3" />
                      <span className="text-gray-700">{credential}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                I believe in building lasting relationships with my clients through transparent communication,
                ethical practice, and personalized attention to each case. My goal is to provide not just legal
                representation, but strategic guidance that helps clients achieve their objectives while
                protecting their interests.
              </p>

              <div className="flex items-center space-x-4">
                <a
                  href="#contact"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Get Legal Advice
                </a>
                <a
                  href="#services"
                  className="text-amber-600 hover:text-amber-700 font-semibold flex items-center"
                >
                  View All Services
                  <ChevronRight className="w-5 h-5 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*++++++++++++++++++++++++++++++++++++++++++++++++ Services Section ++++++++++++++++++++++++++++++++++++++++++++*/}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <Shield className="w-4 h-4 mr-2" />
              Legal Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Comprehensive Legal Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert legal services tailored to meet your specific needs with dedication,
              professionalism, and proven results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-amber-200 transition-all duration-300 group">
                <div className="flex items-center justify-center w-16 h-16 bg-amber-50 rounded-xl mb-6 group-hover:bg-amber-100 transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
                <div className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-amber-600 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <a
                    href="#contact"
                    className="text-amber-600 hover:text-amber-700 font-semibold flex items-center group-hover:translate-x-2 transition-transform"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*++++++++++++++++++++++++++++++++++++++++ Practice Areas +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/}
      <section id="practice" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <Gavel className="w-4 h-4 mr-2" />
              Practice Areas
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Areas of Legal Expertise
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized knowledge across multiple areas of law to serve diverse client needs
              with expertise and precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {practiceAreas.map((area, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:border-amber-200 border border-gray-100 transition-all duration-300 group">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-amber-600 mr-3 group-hover:scale-110 transition-transform" />
                  <span className="text-slate-800 font-medium">{area}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/*+++++++++++++++++++++++++++++++++++++++++++++++++++++ Contact Section +++++++++++++++++++++++++++++++++++++++++++++++++++*/}
      <section id="contact" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center bg-amber-600/20 text-amber-400 px-6 py-3 rounded-full text-lg font-medium mb-4">
              <Phone className="w-6 h-6 mr-3" />
              Contact Me
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-8 text-amber-400">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-12 h-12 bg-amber-600 rounded-lg mr-4 flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white mb-1">Phone</p>
                    <p className="text-gray-300">+91 9415128663</p>
                    {/* <p className="text-sm text-gray-400">Available Mon-Sat, 10 AM - 7 PM</p> */}
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center justify-center w-12 h-12 bg-amber-600 rounded-lg mr-4 flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white mb-1">Email</p>
                    <p className="text-gray-300">ashutosh.adv@outlook.com</p>
                    <p className="text-gray-300">solicitiorsworkshop@gmail.com</p>
                    {/* <p className="text-sm text-gray-400">Response within 24 hours</p> */}
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center justify-center w-12 h-12 bg-amber-600 rounded-lg mr-4 flex-shrink-0 mt-1">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-white mb-1">Noida Office</p>
                      <p className="text-gray-300">Office No. 1610, Tower A, 16th Floor, Spectrum Metro Mall, Phase-1, Sector 75, Noida - 201301.</p>
                    </div>
                    <div>
                      <p className="font-medium text-white mb-1">Kolkata Office</p>
                      <p className="text-gray-300">10, Kiran Shankar Roy Road, B.B.D Bagh, Kolkata - 700001.</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center justify-center w-12 h-12 bg-amber-600 rounded-lg mr-4 flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white mb-1">Office Hours</p>
                    <p className="text-gray-300">Mon-Fri: 10:00 AM - 7:00 PM<br />Sat: 11:00 AM - 2:00 PM</p>
                    <p className="text-sm text-gray-400">By appointment only</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-8 text-amber-400">Do you have any legal query ?</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white placeholder-gray-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white placeholder-gray-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="tel"
                      placeholder="Your Phone"
                      className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white placeholder-gray-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <div>
                    <select className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors">
                      <option value="">Your Query</option>
                      <option value="civil">Get Support</option>
                      <option value="corporate">Guidance</option>
                      <option value="documentation">Find Solutions</option>
                      <option value="consultation">Discuss Options</option>
                    </select>
                  </div>
                </div>

                <div>
                  <textarea
                    rows={4}
                    placeholder="Describe your legal query in detail"
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white placeholder-gray-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Consultation
                </button>

                <p className="text-sm text-gray-400 text-center">
                  All consultations are confidential and protected by attorney-client privilege.
                </p>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* +++++++++++++++++++++++++++++++++++++++++++++Footer +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/}
      <footer className="bg-slate-800 text-white py-12 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <Scale className="w-8 h-8 text-amber-500 mr-2" />
                <span className="text-xl font-bold text-white">Ashutosh Ojha</span>
              </div>
              <p className="text-gray-400 mb-4">
                Professional legal services with integrity, expertise, and dedication to client success.
              </p>
              <div className="flex items-center text-sm text-gray-400">
                <UserCheck className="w-4 h-4 mr-2" />
                Licensed Advocate | Bar Registration No: ABC123456
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="#about" className="block text-gray-400 hover:text-amber-400 transition-colors">About</a>
                <a href="#services" className="block text-gray-400 hover:text-amber-400 transition-colors">Services</a>
                <a href="#practice" className="block text-gray-400 hover:text-amber-400 transition-colors">Practice Areas</a>
                <a href="#contact" className="block text-gray-400 hover:text-amber-400 transition-colors">Contact</a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Legal Services</h4>
              <div className="space-y-2">
                <div className="text-gray-400">Get Support</div>
                <div className="text-gray-400">Guidance</div>
                <div className="text-gray-400">Find Solutions</div>
                <div className="text-gray-400">Discuss Options</div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 mb-4 md:mb-0">
                2024 Ashutosh Ojha - Legal Consultant. All rights reserved.
              </div>
              <div className="text-gray-400 text-sm">
                Professional Legal Services | Confidential Consultations
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;