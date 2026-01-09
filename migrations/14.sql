
CREATE TABLE legal_documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL CHECK(type IN ('privacy', 'terms', 'cancellation')),
  title TEXT NOT NULL,
  html_content TEXT,
  pdf_url TEXT,
  use_pdf BOOLEAN DEFAULT 0,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_by_user_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_legal_documents_type ON legal_documents(type);

-- Seed default legal documents
INSERT INTO legal_documents (type, title, html_content) VALUES 
('privacy', 'Privacy Policy', '<h2>Introduction</h2>
<p>Novel Sphere Vacations ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>

<h2>Information We Collect</h2>
<p>We collect information that you provide directly to us, including:</p>
<ul>
<li>Personal identification information (name, email address, phone number)</li>
<li>Travel preferences and booking details</li>
<li>Payment information</li>
<li>Communication preferences</li>
</ul>

<h2>How We Use Your Information</h2>
<p>We use the information we collect to:</p>
<ul>
<li>Process your travel bookings and reservations</li>
<li>Communicate with you about your trips</li>
<li>Provide customer support</li>
<li>Send you promotional offers and updates (with your consent)</li>
<li>Improve our services and website</li>
</ul>

<h2>Cookies & Tracking Technologies</h2>
<p>We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>

<h2>Data Security</h2>
<p>We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>

<h2>Sharing of Information</h2>
<p>We do not sell your personal information. We may share your information with:</p>
<ul>
<li>Service providers who assist us in operating our business</li>
<li>Travel partners (airlines, hotels, tour operators)</li>
<li>Legal authorities when required by law</li>
</ul>

<h2>Third-Party Services</h2>
<p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.</p>

<h2>Your Rights</h2>
<p>You have the right to:</p>
<ul>
<li>Access your personal information</li>
<li>Request corrections to your data</li>
<li>Request deletion of your information</li>
<li>Opt-out of marketing communications</li>
</ul>

<h2>Changes to This Policy</h2>
<p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

<h2>Contact Information</h2>
<p>If you have any questions about this Privacy Policy, please contact us at:</p>
<p>Email: info@novelspherevacations.in<br>Phone: 8248596124<br>Address: 1st Floor, WeWork, Olympia Cyberspace, Guindy, Chennai, Tamil Nadu 600032</p>'),

('terms', 'Terms & Conditions', '<h2>Introduction</h2>
<p>Welcome to Novel Sphere Vacations. By accessing or using our services, you agree to be bound by these Terms and Conditions.</p>

<h2>Eligibility</h2>
<p>You must be at least 18 years old to use our services. By using our services, you represent and warrant that you meet this requirement.</p>

<h2>Services Provided</h2>
<p>Novel Sphere Vacations provides travel planning, booking, and related services including but not limited to:</p>
<ul>
<li>Tour packages and itinerary planning</li>
<li>Flight and hotel bookings</li>
<li>Visa assistance</li>
<li>Travel insurance</li>
<li>Transportation arrangements</li>
</ul>

<h2>Pricing & Payments</h2>
<p>All prices are quoted in Indian Rupees (INR) and are subject to change without notice. Payment terms:</p>
<ul>
<li>A deposit may be required to confirm bookings</li>
<li>Full payment is typically due before travel</li>
<li>Payment methods accepted: bank transfer, UPI, credit/debit cards</li>
<li>All payments are subject to applicable taxes</li>
</ul>

<h2>Booking Confirmation</h2>
<p>Your booking is confirmed only upon receipt of payment and written confirmation from us. We reserve the right to refuse any booking at our discretion.</p>

<h2>User Responsibilities</h2>
<p>You are responsible for:</p>
<ul>
<li>Providing accurate information</li>
<li>Ensuring valid travel documents (passport, visa)</li>
<li>Complying with all applicable laws and regulations</li>
<li>Arriving at departure points on time</li>
<li>Your behavior during travel</li>
</ul>

<h2>Limitation of Liability</h2>
<p>Novel Sphere Vacations acts as an intermediary between customers and service providers. We are not liable for:</p>
<ul>
<li>Acts of third-party service providers</li>
<li>Force majeure events</li>
<li>Personal injury or property damage during travel</li>
<li>Changes made by airlines, hotels, or other vendors</li>
</ul>

<h2>Intellectual Property</h2>
<p>All content on our website, including text, graphics, logos, and images, is the property of Novel Sphere Vacations and protected by copyright laws.</p>

<h2>Governing Law</h2>
<p>These Terms and Conditions are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Chennai, Tamil Nadu.</p>

<h2>Modifications to Terms</h2>
<p>We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the modified terms.</p>

<h2>Contact Details</h2>
<p>For questions about these Terms and Conditions, contact us at:</p>
<p>Email: info@novelspherevacations.in<br>Phone: 8248596124<br>Address: 1st Floor, WeWork, Olympia Cyberspace, Guindy, Chennai, Tamil Nadu 600032</p>'),

('cancellation', 'Cancellation & Refund Policy', '<h2>Booking Cancellation by Customer</h2>
<p>Customers may cancel their bookings subject to the following terms:</p>
<ul>
<li>Cancellations must be made in writing via email to info@novelspherevacations.in</li>
<li>Cancellation fees apply based on the time before departure</li>
<li>Cancellation charges are calculated from the date we receive written notice</li>
</ul>

<h2>Cancellation Charges</h2>
<p>The following cancellation charges apply (as a percentage of total booking cost):</p>
<ul>
<li>More than 45 days before departure: 10% or booking deposit (whichever is higher)</li>
<li>31-45 days before departure: 25%</li>
<li>21-30 days before departure: 50%</li>
<li>10-20 days before departure: 75%</li>
<li>Less than 10 days before departure: 100% (no refund)</li>
</ul>

<h2>Refund Eligibility</h2>
<p>Refunds are subject to:</p>
<ul>
<li>Cancellation policies of airlines, hotels, and other service providers</li>
<li>Processing fees and transaction charges</li>
<li>Availability of refundable components in your booking</li>
</ul>

<h2>Airline, Hotel & Vendor Policies</h2>
<p>Many components of your booking are subject to the cancellation policies of third-party providers. These may include:</p>
<ul>
<li>Non-refundable airline tickets</li>
<li>Hotel cancellation deadlines</li>
<li>Tour operator terms and conditions</li>
</ul>
<p>We will clearly communicate these restrictions at the time of booking.</p>

<h2>No-Show Policy</h2>
<p>Failure to show up for any confirmed booking without prior cancellation notice will result in 100% cancellation charges with no refund.</p>

<h2>Refund Timeline</h2>
<p>Approved refunds will be processed within:</p>
<ul>
<li>7-10 business days for UPI/bank transfers</li>
<li>10-15 business days for credit/debit card refunds</li>
<li>Subject to vendor refund processing times</li>
</ul>

<h2>Force Majeure</h2>
<p>In cases of force majeure events (natural disasters, political unrest, pandemics, etc.), standard cancellation policies may not apply. We will work with you to reschedule or provide credit for future travel where possible.</p>

<h2>International Bookings</h2>
<p>For international travel, additional restrictions may apply based on destination country regulations and international travel policies.</p>

<h2>Amendments vs Cancellations</h2>
<p>Amendments to bookings (date changes, name changes, etc.) may incur fees and are subject to availability. Contact us for specific amendment charges.</p>

<h2>Contact for Cancellations</h2>
<p>To cancel or modify your booking, please contact us immediately:</p>
<p>Email: info@novelspherevacations.in<br>Phone: 8248596124<br>Office Hours: 10 AM – 7 PM<br>Address: 1st Floor, WeWork, Olympia Cyberspace, Guindy, Chennai, Tamil Nadu 600032</p>

<p><strong>Note:</strong> This cancellation policy is subject to change. The policy applicable at the time of your booking will govern your cancellation terms.</p>');
