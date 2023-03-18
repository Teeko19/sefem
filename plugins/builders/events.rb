require "icalendar"

class Builders::Events < SiteBuilder
  def build
    @site = site

    hook :events, :post_read do |event|
      unless event.data.ends_at.present?
        event.data.ends_at = nil
      end

      # Thumbnails
      event.data.tag_thumbnail = get_tag_thumbnail(event)
      event.data.gradient_thumbnail = generate_gradient_thumbnail

      # iCalendar
      ical_file_path = "#{event.data.title} - #{SecureRandom.alphanumeric(10)}.ics"
      @site.generated_pages << make_file(ical_file_path, make_ical(event.data))
      event.data.ical = "ical/#{ical_file_path}"
    end
  end

  private

  # Thumbnails

  def get_tag_thumbnail(event)
    site.data.tags.select { |key, value| value&.title == event.taxonomies.tag.terms&.first&.label }&.first&.last&.thumbnails&.sample
  end

  def generate_gradient_thumbnail
    angle = (rand * 360).floor

    color_a = "##{Random.hex(3)}"
    color_b = "##{Random.hex(3)}"

    "linear-gradient(#{angle}deg, #{color_a}, #{color_b})"
  end

  # iCalendar

  def make_ical(event)
    cal = Icalendar::Calendar.new

    description = <<~HEREDOC
      L'evento si terrà a #{event.city}#{" in " + event.address + "."  if event.address.present?}

      Visita sefem-ilcalendariodeglieventi.it per rimanere sempre aggiornato su ciò che succede nei dintorni.

      Se vieni a conoscenza di un evento nella tua zona, contattaci all'indirizzo email: postmaster@sefem-ilcalendariodeglieventi.it.
    HEREDOC

    cal.event do |e|
      e.dtstart = event.ends_at.present? ?
                    Icalendar::Values::DateTime.new(event.starts_at) :
                    Icalendar::Values::Date.new(event.starts_at)
      e.dtend   = event.ends_at.present? ?
                    Icalendar::Values::DateTime.new(event.ends_at) :
                    Icalendar::Values::Date.new(event.starts_at)

      e.summary     = event.title
      e.description = description.strip

      e.location = event.city
      e.url      = event.link
      e.ip_class = "PRIVATE"
    end

    cal.publish
    cal.to_ical
  end

  def make_file(path, content)
    Bridgetown::GeneratedPage.new(@site, __dir__, "ical", path, from_plugin: true).tap do |file|
      file.content = content
      file.output
    end
  end
end
