module ModalHelper
  def modal_helper(options)
    render :partial => 'widgets/modal', :locals => options
  end
end
