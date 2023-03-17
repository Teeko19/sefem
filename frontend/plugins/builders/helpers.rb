class Builders::Helpers < SiteBuilder
  def build
    helper :l
    helper :remote_asset_url
    helper :event_search_keys
    helper :event_with_multiple_days?
    helper :event_ends_next_month?
    helper :event_tag_details
    helper :month_for_date
  end

  def l(object, **options)
    I18n.localize(object, **options)
  end

  def remote_asset_url(url)
    Bridgetown.env.development? ? "http://127.0.0.1:8090/api/files/#{url}" : url
  end

  def event_search_keys(event)
    keys = []

    keys << event.data&.title
    keys << event.data&.location&.city
    keys << event.data&.location&.address

    keys.join(" ").downcase
  end

  def event_with_multiple_days?(event)
    starts_at = event.data.starts_at
    ends_at   = event.data.ends_at

    ends_at.present? && (starts_at.day != ends_at.day || starts_at.month != ends_at.month)
  end

  def event_ends_next_month?(event)
    starts_at = event.data.starts_at
    ends_at   = event.data.ends_at

    ends_at.present? && starts_at.month != ends_at.month
  end

  def event_tag_details(tag)
    tag_details = site.data.tags.select { |key, value| value&.title == tag&.label }&.first&.last

    tag_details || HashWithDotAccess::Hash.new
  end

  def month_for_date(date)
    site.collections.months.resources_by_slug[date.month.to_s]
  end
end
