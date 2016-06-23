# Form class for cleaning up submission of Completable objects
# Completable currently accepts nested attributes for TagTitles so
# Completable.create({..., :tag_titles => [{:title => 'Costco'}]})
# works nicely.  However, this is still unwieldy outside of Rails and would be
# nicer if simplified to:
# Completable.create({..., :tags => ['Costco']})
# CompletableForm.submit({..., :tags => ['Costco', 'Target']})


class CompletableForm
  attr_reader :resource, :params

  def initialize(resource=nil, params=nil)
    @resource = resource || Completable.new
    store_params(params)
    self
  end

  def completable
    @resource
  end

  def submit(params=nil)
    store_params(params)
    raise ArgumentError, "No params given to CompletableForm object on submit" if !@params
    tag_titles_to_bind = handle_tag_params
    resource.attributes = @params
    output = resource.save
    if output
      bind_tags(tag_titles_to_bind)
      reload_resource(@params)
    end
    output
  end

  def method_missing(sym, *args, &block)
    @resource.send sym, *args, &block
  end

  private
  
  def bind_tags(tag_titles)
    resource.update_attributes(:tag_titles => tag_titles) unless tag_titles.empty?
  end

  def handle_tag_params
    return [] unless @params[:tags].present?
    tag_values = @params.delete(:tags)
    output = nil
    ActiveRecord::Base.transaction do
      existing_tag_titles = TagTitle.where(:title => tag_values)
      tag_titles_to_create = tag_values - existing_tag_titles.map(&:title)
      new_tag_titles = []
      tag_titles_to_create.each do |new_title|
        new_tag_titles << TagTitle.create(:title => new_title)
      end
      output = existing_tag_titles + new_tag_titles
    end
    output
  end

  def reload_resource(params)
    @resource = Completable.find(resource.id) if params[:type]
  end

  def store_params(params)
    @params = params.with_indifferent_access if params.present?
  end
end
