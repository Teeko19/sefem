require "icalendar"

class Builders::Api::Events < SiteBuilder
  def build
    @site = site

    get "#{config.endpoint}/collections/events/records?expand=tags" do |data|
      data.items.each do |event|
        # Thumbnails
        tag_thumbnail = get_tag_thumbnail(event)
        gradient_thumbnail = generate_gradient_thumbnail

        # iCalendar
        ical_file_path = "#{event.title} - #{event.id}.ics"
        @site.generated_pages << make_file(ical_file_path, make_ical(event))

        add_resource :events, "#{event.id}.md" do
          layout :event
          id event.id

          title event.title
          starts_at DateTime.parse(event.starts_at)
          ends_at DateTime.parse(event.ends_at) if event.ends_at.present?
          tags event.expand.tags.map { |t| t.title } if defined?(event.expand.tags)
          location do
            city event.city
            address event.address
          end
          link event.link
          thumbnail event.thumbnail.present? ? "#{event.collectionId}/#{event.id}/#{event.thumbnail}" : nil
          flyer event.flyer.present? ? "#{event.collectionId}/#{event.id}/#{event.flyer}" : nil

          tag_thumbnail tag_thumbnail
          gradient_thumbnail gradient_thumbnail

          ical "ical/#{ical_file_path}"
        end
      end
    end
  end

  private

  # Thumbnails

  def get_tag_thumbnail(event)
    tag = event.expand&.tags&.first
    thumbnail = tag&.thumbnails&.sample

    thumbnail ? "#{tag.collectionId}/#{tag.id}/#{thumbnail}" : nil
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
                    Icalendar::Values::DateTime.new(DateTime.parse(event.starts_at)) :
                    Icalendar::Values::Date.new(DateTime.parse(event.starts_at))
      e.dtend   = event.ends_at.present? ?
                    Icalendar::Values::DateTime.new(DateTime.parse(event.ends_at)) :
                    Icalendar::Values::Date.new(DateTime.parse(event.starts_at))

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
