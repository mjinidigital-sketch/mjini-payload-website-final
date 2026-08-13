export default function GoogleMap() {
  return (
    <div className="w-full overflow-hidden rounded-2xl shadow-lg">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8405881715466!2d36.8074903!3d-1.2684691!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f172fed85429f%3A0xe6e83d4736259aea!2sMjini%20Digital!5e0!3m2!1sen!2ske!4v1783954404200!5m2!1sen!2ske"
        className="w-full h-[450px] border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        title="Mjini Digital Location"
      />
    </div>
  )
}
