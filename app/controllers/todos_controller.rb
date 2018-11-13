class TodosController < ApplicationController
  before_action :authenticate_user!
  before_action :verify_auth_token
  before_action :load_current_user_household, :only => [:index, :create, :clear_completed]
  before_action :load_todo, :only => [:accept, :complete, :destroy, :update, :uncomplete, :reorder]
  before_action :prepare_completable_form, :only => [:create, :update]

  def index
    # TODO: (ha ha ha...) this must be heavily optimized, mapping over the
    @todos = @household.completables.includes([{:household => :members}, :creator, :completor, :acceptor, :tags]).decorate.map{|si| [si.id, si.to_json(current_user)] }.to_h
    render :json => {:todos => @todos}, :status => :ok
  end

  def show
  end

  def edit
  end

  def new
  end

  def create
    begin
      @completable_form.submit(todo_params.merge({:household => @household, :creator => current_user}))
      @todo = @completable_form.resource.decorate
      status = :ok
    rescue
      status = 500
    end
    render_todo_to_json(status)
  end

  def update
    return render :status => 400 unless @todo
    return render :status => 500 unless @completable_form.submit(todo_params)
    @todo = @completable_form.resource.decorate
    render_todo_to_json(:ok)
  end

  def destroy
    return unauthorized_response unless can?(:destroy, @todo)
    begin
      @todo.destroy!
      status = :ok
    rescue
      status = 500
    end
    render_todo_to_json(status)
  end

  def accept
    return unauthorized_response unless can?(:accept, @todo)
    begin
      @todo.accept!(:accepted_by => current_user)
      status = :ok
    rescue
      status = 500
    end
    render_todo_to_json(status)
  end

  def clear_completed
    return unauthorized_response unless can?(:administrate, @household)
    status = :ok
    begin
      @household.clear_completed_completables
    rescue => e
        status = 500
    end
    render :json => {}, :status => status
  end

  def complete
    return unauthorized_response unless can?(:complete, @todo)
    begin
      @todo.complete!(:completed_by => current_user)
      status = :ok
    rescue
      status = 500
    end
    render_todo_to_json(status)
  end

  def reorder
    return unauthorized_response unless can?(:reorder, @todo)
    begin
      neighboring_todo = Completable.find(params[:todo_neighbor_id])
      is_todo_neighbor_north = params[:is_todo_neighbor_north]
      @todo.reorder_near(neighboring_todo, is_todo_neighbor_north=='true')
      status = :ok
    rescue Exception => e
      status = 500
    end
    render_todo_to_json(status)
  end

  def uncomplete
    return unauthorized_response unless can?(:uncomplete, @todo)
    begin
      @todo.uncomplete!(:uncompleted_by => current_user)
      status = :ok
    rescue
      status = 500
    end
    render_todo_to_json(status)
  end

  private

  def unauthorized_response(message=nil)
    render :json => {:message => message}, :status => 403
  end

  def prepare_completable_form
    @completable_form = CompletableForm.new(@todo)
  end

  def load_todo
    @todo = Completable.find(params[:id] ||
                             params[:todo_id] ||
                             params[:todo][:id])
                       .decorate
  end

  def todo_params
    params.require(:todo).permit(:title, :notes, :type, :tags => [])
  end

  def render_todo_to_json(status)
    render :json => @todo.to_json(current_user), :status => status
  end
end
