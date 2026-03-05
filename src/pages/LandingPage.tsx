import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Phone, MapPin, Clock, Star, CheckCircle2, Calendar, ChevronRight, Menu, X, Facebook, Instagram, Twitter, Activity, Crown, Sparkles, Scissors, Smile, Anchor } from 'lucide-react';
import { api } from '../lib/api';
import { format } from 'date-fns';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Booking State
  const [bookingDate, setBookingDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [patientName, setPatientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [service, setService] = useState('General Checkup');
  const [message, setMessage] = useState('');
  const [bookingStatus, setBookingStatus] = useState(''); // 'loading', 'success', 'error'

  useEffect(() => {
    fetchSlots(bookingDate);
  }, [bookingDate]);

  const fetchSlots = async (date) => {
    try {
      const data = await api.getSlots(date);
      setAvailableSlots(data.availableSlots);
    } catch (err) {
      console.error('Failed to fetch slots', err);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      alert('Please select a time slot');
      return;
    }
    
    setBookingStatus('loading');
    try {
      await api.bookAppointment({
        patientName,
        phoneNumber,
        date: bookingDate,
        timeSlot: selectedSlot
      });
      setBookingStatus('success');
      // Reset form
      setPatientName('');
      setPhoneNumber('');
      setSelectedSlot('');
      setMessage('');
      fetchSlots(bookingDate); // Refresh slots
    } catch (err) {
      setBookingStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Top Bar */}
      <div className="bg-teal-700 text-white py-2 px-4 text-sm hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex space-x-6">
            <span className="flex items-center"><Phone className="w-4 h-4 mr-2" /> +91 7506193907</span>
            <span className="flex items-center"><Clock className="w-4 h-4 mr-2" /> Mon-Sat: 10:00 AM - 9:00 PM</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Shop No 2A, Chest Nut Plaza, Gladys Alvares Road, Thane West</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img src="/Logo_Final.png" alt="Heramb Dental Clinic Logo" className="h-12 w-auto mr-3" />
                <div>
                  <h1 className="text-xl font-bold text-teal-900 leading-tight">Heramb Dental Clinic</h1>
                  <p className="text-xs text-teal-600 font-medium tracking-wider uppercase">& Orthodontic Centre</p>
                </div>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-slate-600 hover:text-teal-600 font-medium transition-colors">Home</a>
              <a href="#about" className="text-slate-600 hover:text-teal-600 font-medium transition-colors">About Us</a>
              <a href="#services" className="text-slate-600 hover:text-teal-600 font-medium transition-colors">Services</a>
              <a href="#testimonials" className="text-slate-600 hover:text-teal-600 font-medium transition-colors">Reviews</a>
              <a href="#contact" className="text-slate-600 hover:text-teal-600 font-medium transition-colors">Contact</a>
              <a href="#contact" className="bg-teal-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Book Appointment
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-600 hover:text-teal-600 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#home" className="block px-3 py-2 text-slate-600 font-medium hover:bg-teal-50 hover:text-teal-600 rounded-md" onClick={() => setIsMenuOpen(false)}>Home</a>
              <a href="#about" className="block px-3 py-2 text-slate-600 font-medium hover:bg-teal-50 hover:text-teal-600 rounded-md" onClick={() => setIsMenuOpen(false)}>About Us</a>
              <a href="#services" className="block px-3 py-2 text-slate-600 font-medium hover:bg-teal-50 hover:text-teal-600 rounded-md" onClick={() => setIsMenuOpen(false)}>Services</a>
              <a href="#testimonials" className="block px-3 py-2 text-slate-600 font-medium hover:bg-teal-50 hover:text-teal-600 rounded-md" onClick={() => setIsMenuOpen(false)}>Reviews</a>
              <a href="#contact" className="block px-3 py-2 text-slate-600 font-medium hover:bg-teal-50 hover:text-teal-600 rounded-md" onClick={() => setIsMenuOpen(false)}>Contact</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative bg-teal-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-teal-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-10 sm:pt-16 lg:pt-20">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-sm font-semibold mb-6">
                  <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                  4.5+ Star Rated Clinic in Thane
                </div>
                <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Advanced Dental Care</span>{' '}
                  <span className="block text-teal-600 xl:inline">for Your Perfect Smile</span>
                </h1>
                <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Welcome to Heramb Dental Clinic and Orthodontic Centre. Dr. Sumedh Hosing, M.D.S., and our expert team provide comprehensive dental care in a comfortable, state-of-the-art environment in Thane West.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <a href="#contact" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-teal-600 hover:bg-teal-700 md:py-4 md:text-lg md:px-10 transition-colors">
                      Book an Appointment
                    </a>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a href="#services" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-teal-700 bg-teal-100 hover:bg-teal-200 md:py-4 md:text-lg md:px-10 transition-colors">
                      Our Services
                    </a>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Modern dental clinic"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-50 to-transparent lg:via-teal-50/20"></div>
        </div>
      </section>

      {/* Stats/Trust Section */}
      <section className="bg-teal-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            <div>
              <div className="text-4xl font-extrabold text-white mb-2">15+</div>
              <div className="text-teal-100 font-medium">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-white mb-2">5000+</div>
              <div className="text-teal-100 font-medium">Happy Patients</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-white mb-2">4.5</div>
              <div className="text-teal-100 font-medium">Google Rating</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-white mb-2">100%</div>
              <div className="text-teal-100 font-medium">Safe & Hygienic</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-12 lg:mb-0">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Dentist with patient" 
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-teal-900/10"></div>
              </div>
            </div>
            <div>
              <h2 className="text-base text-teal-600 font-semibold tracking-wide uppercase">About Us</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Expert Dental Care by Dr. Sumedh Hosing, M.D.S.
              </p>
              <p className="mt-4 text-lg text-slate-500">
                At Heramb Dental Clinic and Orthodontic Centre, we are dedicated to providing the highest quality dental care in a relaxed, comfortable, and safe environment. Located conveniently in Thane West, our clinic is equipped with modern technology to ensure precise diagnostics and effective treatments.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-teal-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-slate-900">Experienced Professionals</h3>
                    <p className="mt-1 text-slate-500">Led by Dr. Sumedh Hosing, M.D.S., bringing years of expertise in dentistry and orthodontics.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-teal-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-slate-900">Advanced Technology</h3>
                    <p className="mt-1 text-slate-500">We use state-of-the-art equipment for painless and efficient dental procedures.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-teal-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-slate-900">Patient-Centric Approach</h3>
                    <p className="mt-1 text-slate-500">Your comfort and satisfaction are our top priorities. We tailor treatments to your specific needs.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base text-teal-600 font-semibold tracking-wide uppercase">Our Services</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Comprehensive Dental Solutions
            </p>
            <p className="mt-4 text-xl text-slate-500">
              From routine check-ups to complex orthodontic procedures, we offer a full range of dental services under one roof.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-8 border border-slate-100">
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                <Activity className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Root Canal Treatment (RCT)</h3>
              <p className="text-slate-500 mb-4">Save your natural teeth with our painless single-visit root canal treatments performed using modern rotary endodontics.</p>
              <a href="#contact" className="text-teal-600 font-medium flex items-center hover:text-teal-700">Learn more <ChevronRight className="w-4 h-4 ml-1" /></a>
            </div>

            {/* Service 2 */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-8 border border-slate-100">
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                <Crown className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Crowns, Bridges & Zirconia Caps</h3>
              <p className="text-slate-500 mb-4">Restore damaged teeth with high-quality crowns and bridges, including durable and aesthetic Zirconia caps.</p>
              <a href="#contact" className="text-teal-600 font-medium flex items-center hover:text-teal-700">Learn more <ChevronRight className="w-4 h-4 ml-1" /></a>
            </div>

            {/* Service 3 */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-8 border border-slate-100">
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Cleaning & Polishing</h3>
              <p className="text-slate-500 mb-4">Professional teeth cleaning (scaling) and polishing to remove plaque, tartar, and stains for a brighter smile.</p>
              <a href="#contact" className="text-teal-600 font-medium flex items-center hover:text-teal-700">Learn more <ChevronRight className="w-4 h-4 ml-1" /></a>
            </div>

            {/* Service 4 */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-8 border border-slate-100">
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                <Scissors className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Wisdom Tooth Extraction</h3>
              <p className="text-slate-500 mb-4">Safe and painless extraction of wisdom teeth and other problematic teeth by experienced oral surgeons.</p>
              <a href="#contact" className="text-teal-600 font-medium flex items-center hover:text-teal-700">Learn more <ChevronRight className="w-4 h-4 ml-1" /></a>
            </div>

            {/* Service 5 */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-8 border border-slate-100">
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                <Smile className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Complete & Partial Dentures</h3>
              <p className="text-slate-500 mb-4">Custom-made complete and partial dentures to restore function and aesthetics for patients with missing teeth.</p>
              <a href="#contact" className="text-teal-600 font-medium flex items-center hover:text-teal-700">Learn more <ChevronRight className="w-4 h-4 ml-1" /></a>
            </div>

            {/* Service 6 */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-8 border border-slate-100">
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                <Anchor className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Gum Surgeries / Implants</h3>
              <p className="text-slate-500 mb-4">Advanced gum treatments and dental implants to replace missing teeth and ensure long-term oral health.</p>
              <a href="#contact" className="text-teal-600 font-medium flex items-center hover:text-teal-700">Learn more <ChevronRight className="w-4 h-4 ml-1" /></a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base text-teal-600 font-semibold tracking-wide uppercase">Patient Reviews</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              What Our Patients Say
            </p>
            <div className="mt-4 flex justify-center items-center space-x-1">
              <Star className="w-6 h-6 text-yellow-400 fill-current" />
              <Star className="w-6 h-6 text-yellow-400 fill-current" />
              <Star className="w-6 h-6 text-yellow-400 fill-current" />
              <Star className="w-6 h-6 text-yellow-400 fill-current" />
              <Star className="w-6 h-6 text-yellow-400 fill-current" />
              <span className="ml-2 text-lg font-medium text-slate-700">4.5/5 on Google & Justdial</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl shadow-sm">
              <div className="flex text-yellow-400 mb-4">
                <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-slate-600 italic mb-6">"Excellent service! Dr. Sumedh is very professional and explains the treatment clearly. The clinic is very clean and hygienic. Highly recommended for any dental issues."</p>
              <div className="font-medium text-slate-900">- Rahul D.</div>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl shadow-sm">
              <div className="flex text-yellow-400 mb-4">
                <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-slate-600 italic mb-6">"Got my braces done here. The entire process was smooth. The staff is friendly and accommodating with appointments. Very happy with my new smile!"</p>
              <div className="font-medium text-slate-900">- Sneha P.</div>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl shadow-sm">
              <div className="flex text-yellow-400 mb-4">
                <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-slate-600 italic mb-6">"Painless root canal treatment! I was very scared initially, but the doctor made me feel comfortable. Modern equipment and great ambiance."</p>
              <div className="font-medium text-slate-900">- Amit K.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 lg:p-16 bg-teal-700 text-white">
                <h2 className="text-3xl font-extrabold mb-6">Get in Touch</h2>
                <p className="text-teal-100 mb-10 text-lg">
                  Ready to improve your smile? Contact us today to schedule an appointment or ask any questions.
                </p>
                
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-teal-600 p-3 rounded-lg">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium">Phone</h3>
                      <p className="mt-1 text-teal-100 text-lg">+91 7506193907</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-teal-600 p-3 rounded-lg">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium">Location</h3>
                      <p className="mt-1 text-teal-100">
                        Shop No 2A, Chest Nut Plaza Co op Society<br />
                        Smt Gladys Alvares Road, near Khevra Circle<br />
                        Manpada, Thane West, Maharashtra 400610
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-teal-600 p-3 rounded-lg">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium">Clinic Hours</h3>
                      <p className="mt-1 text-teal-100">
                        Monday - Saturday: 10:00 AM - 9:00 PM<br />
                        Sunday: Closed (Prior Appointments Only)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-10 lg:p-16">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Book an Appointment</h3>
                
                {/* Success Message */}
                {bookingStatus === 'success' ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Success!</strong>
                    <span className="block sm:inline"> Your appointment has been booked. We will contact you shortly.</span>
                    <button onClick={() => setBookingStatus('')} className="mt-4 text-sm underline">Book another</button>
                  </div>
                ) : (
                  <form className="space-y-6" onSubmit={handleBook}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
                        <input 
                          type="text" 
                          id="name" 
                          required
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm px-4 py-3 border bg-slate-50" 
                          placeholder="John Doe" 
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone Number</label>
                        <input 
                          type="tel" 
                          id="phone" 
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm px-4 py-3 border bg-slate-50" 
                          placeholder="+91 98765 43210" 
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-slate-700">Date</label>
                        <input 
                          type="date" 
                          id="date" 
                          required
                          min={format(new Date(), 'yyyy-MM-dd')}
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm px-4 py-3 border bg-slate-50" 
                        />
                      </div>
                      <div>
                        <label htmlFor="slot" className="block text-sm font-medium text-slate-700">Time Slot</label>
                        <select 
                          id="slot" 
                          required
                          value={selectedSlot}
                          onChange={(e) => setSelectedSlot(e.target.value)}
                          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm px-4 py-3 border bg-slate-50"
                        >
                          <option value="">Select a slot</option>
                          {availableSlots.map(slot => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-slate-700">Service Required</label>
                      <select 
                        id="service" 
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm px-4 py-3 border bg-slate-50"
                      >
                        <option>General Checkup</option>
                        <option>Orthodontics (Braces)</option>
                        <option>Root Canal</option>
                        <option>Teeth Whitening</option>
                        <option>Dental Implants</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-slate-700">Message (Optional)</label>
                      <textarea 
                        id="message" 
                        rows={4} 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm px-4 py-3 border bg-slate-50" 
                        placeholder="Tell us about your dental issue..."
                      ></textarea>
                    </div>
                    <div>
                      <button 
                        type="submit" 
                        disabled={bookingStatus === 'loading'}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors disabled:opacity-50"
                      >
                        {bookingStatus === 'loading' ? 'Booking...' : 'Request Appointment'}
                      </button>
                      {bookingStatus === 'error' && (
                        <p className="mt-3 text-sm text-center text-red-500">Failed to book appointment. Please try again.</p>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-96 w-full bg-slate-200 relative">
        {/* Placeholder for actual Google Map iframe */}
        <iframe 
          src="https://maps.google.com/maps?q=Heramb%20Dental%20Clinic%20And%20Orthodontic%20Centre%20Thane&t=&z=15&ie=UTF8&iwloc=&output=embed" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={true} 
          loading="lazy"
          title="Clinic Location"
          className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-500"
        ></iframe>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg pointer-events-auto text-center">
            <h3 className="font-bold text-slate-900">Heramb Dental Clinic</h3>
            <p className="text-sm text-slate-600">Gladys Alvares Road, Thane West</p>
            <a href="https://maps.google.com/?q=Heramb+Dental+Clinic+And+Orthodontic+Centre+Thane" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-teal-600 font-medium hover:underline">Get Directions</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center mr-2">
                  <span className="text-white font-bold">H</span>
                </div>
                <span className="text-xl font-bold text-white">Heramb Dental</span>
              </div>
              <p className="text-sm text-slate-400 mb-6">
                Providing advanced dental care and orthodontic solutions in Thane West. Your smile is our priority.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#home" className="hover:text-teal-400 transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-teal-400 transition-colors">About Us</a></li>
                <li><a href="#services" className="hover:text-teal-400 transition-colors">Services</a></li>
                <li><a href="#testimonials" className="hover:text-teal-400 transition-colors">Reviews</a></li>
                <li><a href="#contact" className="hover:text-teal-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#services" className="hover:text-teal-400 transition-colors">Orthodontics</a></li>
                <li><a href="#services" className="hover:text-teal-400 transition-colors">Root Canal</a></li>
                <li><a href="#services" className="hover:text-teal-400 transition-colors">Dental Implants</a></li>
                <li><a href="#services" className="hover:text-teal-400 transition-colors">Cosmetic Dentistry</a></li>
                <li><a href="#services" className="hover:text-teal-400 transition-colors">Pediatric Dentistry</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 text-teal-500 flex-shrink-0" />
                  <span>Shop No 2A, Chest Nut Plaza, Gladys Alvares Road, Thane West 400610</span>
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-teal-500 flex-shrink-0" />
                  <span>+91 7506193907</span>
                </li>
                <li className="flex items-start">
                  <Clock className="w-4 h-4 mr-2 mt-0.5 text-teal-500 flex-shrink-0" />
                  <span>Mon-Sat: 10am - 9pm<br/>Sun: By Appointment</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} Heramb Dental Clinic and Orthodontic Centre. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Designed for Dr. Sumedh Hosing, M.D.S.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
