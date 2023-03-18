class Builders::Inspectors::LinkFormatter < SiteBuilder
  def build
    inspect_html do |document, resource|
      document.query_selector_all("a").each do |anchor|
        next if anchor[:target]

        next unless anchor[:href]&.starts_with?("http") && !anchor[:href]&.include?(site.config.url)

        anchor[:target] = "_blank"
      end
    end
  end
end
