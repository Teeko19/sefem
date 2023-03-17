class Builders::Api::Tags < SiteBuilder
  def build
    hook :site, :post_read do
      get "#{config.endpoint}/collections/tags/records" do |data|
        site.data.tags = {}

        data.items.each do |tag|
          site.data.tags[tag.id] = {
            title: tag.title,
            icon: tag.icon,
            thumbnails: tag.thumbnails.map { |thumbnail| "#{tag.collectionId}/#{tag.id}/#{thumbnail}" }
          }
        end
      end
    end
  end
end
