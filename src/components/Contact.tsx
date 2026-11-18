import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    data.formType = "Homepage Contact Form";

    try {
      let success = false;
      try {
        const response = await fetch("/api/submit-form", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (response.ok) success = true;
      } catch (err) {
        console.warn("Direct API call failed, attempting fallback...", err);
      }

      if (!success) {
        // Fallback to formsubmit.co
        const fbRes = await fetch("https://formsubmit.co/ajax/universal@lendingtreefunds.com", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
        if (fbRes.ok) success = true;
      }

      if (success) {
        setSubmitted(true);
        form.reset();
        alert("Thank you! Your message has been sent successfully. We will get back to you shortly.");
      } else {
        alert("There was an error sending your message. Please try again or call us directly.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Network error. Please try again or contact us by phone.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl font-mono font-bold mb-6">Get in touch</h2>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <p className="font-mono font-bold text-foreground mb-1">Corporate Address</p>
                <p>15303 Ventura Blvd, Suite 850, Sherman Oaks, CA 91403, United States</p>
              </div>
              <div>
                <p className="font-mono font-bold text-foreground mb-1">Contacts</p>
                <p className="hover:text-primary font-semibold"><a href="tel:+14073497496">+1 (407) 349-7496</a></p>
                <p className="hover:text-primary"><a href="mailto:acustomer750@gmail.com">acustomer750@gmail.com</a></p>
              </div>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input name="name" required placeholder="Your name" className="border-2 hover:border-accent transition-colors" />
            <Input name="company" placeholder="Company name" className="border-2 hover:border-accent transition-colors" />
            <Input name="phone" placeholder="Phone number" type="tel" className="border-2 hover:border-accent transition-colors" />
            <Input name="email" required placeholder="Email address" type="email" className="border-2 hover:border-accent transition-colors" />
            <Textarea
              name="message"
              required
              placeholder="Anything else you would like us to know?"
              className="border-2 min-h-32 hover:border-accent transition-colors"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-mono transition-all duration-300 hover:shadow-lg hover:shadow-accent/30 font-bold"
            >
              {isSubmitting ? "Sending message..." : submitted ? "Message Sent!" : "Send message"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
