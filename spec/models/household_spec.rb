require 'spec_helper'

describe Household do
  describe "relationships" do
    describe "memberships" do
      it "should have many memberships" do
        h = Household.new
        h.memberships.should be_empty
        m = Membership.new
        h.memberships << m
        h.memberships.should include m
        h.memberships.should == [m]
      end
    end

    describe "members" do
      it "should have many members which are users through memberships" do
        h = Household.create(:name => 'blah')
        h.members.should be_empty
        u = FactoryGirl.create(:user)
        m = Membership.create(:user => u, :household => h)
        h.reload.members.should include u
      end
    end
  end

  describe "instance methods" do
    describe "#create_todo" do
      context "with a persisted household" do
        let(:household) { FactoryGirl.create(:household) } 
        context "with a valid creator" do
          let(:todo_creator) { FactoryGirl.create(:user) }
          let(:description) { "foobar" }

          it "should return the new todo item" do
            todo = household.create_todo(description, todo_creator)
            todo.should be_a Todo
          end

          it "should create a new Todo item" do
            expect {
              household.create_todo(description, todo_creator)
            }.to change(Todo, :count).by(1)
          end

          it "should add the todo item to the household" do
            expect {
              household.create_todo(description, todo_creator)
            }.to change(household.todos, :count).by(1)
          end

          it "should save the description on the todo item" do
            todo = household.create_todo(description, todo_creator)
            todo.description.should == description
          end

          it "should store the creator of the todo item" do
            todo = household.create_todo(description, todo_creator)
            todo.creator.should == todo_creator
          end

          context "when the creator of the todo doesn't belong to the household" do
            let(:other_household) { FactoryGirl.create(:household) }
            before do
              creator.households = [other_household]
            end

            it "should raise an error"
          end

          context "with a nil description" do
            let(:description) { nil }
            it "should raise an error" do
              expect {
                household.create_todo(description, todo_creator)
              }.to raise_error
            end
          end
        end

        context "with a nil creator" do
          let(:description) { 'foobar' }
          let(:todo_creator) { nil }

          it "should raise an error" do
            expect {
              household.create_todo(description, todo_creator)
            }.to raise_error
          end
        end
      end
    end
  end
end
