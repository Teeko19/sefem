class Builders::Helpers < SiteBuilder
  def build
    helper :event_search_keys
    helper :event_with_multiple_days?
    helper :event_tag_icon
  end

  FOO = 1 # should be highlighted as "write"

  def foo
    FOO # should be highlighted as "read"
  end

  def event_search_keys(event)
    keys = []

    keys << event.data&.title
    keys << event.data&.location&.city
    keys << event.data&.location&.address

    keys.join(" ").downcase
  end

  def event_with_multiple_days?(event)
    event.data.ends_at.present? && event.data.starts_at.day != event.data.ends_at.day
  end

  def event_tag_icon(tag)
    case tag.label
    when "Famiglie"
      "family_restroom"
    when "Film"
      "movie"
    when "Mercatino"
      "storefront"
    when "Musica"
      "music_note"
    when "Natura"
      "forest"
    when "Street Food"
      "fastfood"
    when "Teatro"
      "theater_comedy"
    end
  end
end
