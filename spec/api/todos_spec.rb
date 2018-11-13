require 'rails_helper'
require 'rspec/mocks'
require 'rspec/mocks/standalone'

describe "todos", :type => :request do
  before do
    allow_any_instance_of(ApplicationController).to receive(:verify_auth_token).and_return(true)
  end
  context "with a household" do
    let(:household) { FactoryGirl.create(:household) }
    context "and a logged in member of the household" do
      let(:member) { m = FactoryGirl.create(:membership, :household => household); m.user }
      before do
        sign_in(member)
      end

      describe "#clear_completed" do
        it "renders forbidden" do
          delete "/household/todos/clear_completed"
          assert_response :forbidden
        end
      end
    end

    context "and a logged in admin of the household" do
      let(:admin) { m = FactoryGirl.create(:household_admin, :household => household); m.user}
      before do
        sign_in(admin)
      end

      describe "#clear_completed" do
        context "with no todos" do
          before do
            expect(household.completables).to be_empty
          end

          it "renders success" do
            delete "/household/todos/clear_completed"
            assert_response :success
          end

          it "renders an empty json" do
            delete "/household/todos/clear_completed"
            expect(response.body).to eq("{}")
          end
        end

        context "with a todo" do
          let!(:todo) { FactoryGirl.create(:todo, :household => household)}

          it "renders success" do
            delete "/household/todos/clear_completed"
            assert_response :success
          end
        end

        context "with a completed todo" do
          let!(:completed_todo) { FactoryGirl.create(:completed_todo, :household => household)}
          it "renders success" do
            delete "/household/todos/clear_completed"
            assert_response :success
          end
        end
      end
    end
  end
end
