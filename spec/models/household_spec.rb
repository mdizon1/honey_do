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
    let(:household) { FactoryGirl.create(:household) }
    describe "#add_member!" do
      context "with a user" do
        let(:user) { FactoryGirl.create(:user) }

        it "should add the user as a member of the household" do
          household.members.should_not be_include(user)
          household.add_member!(user)
          household.members.should be_include(user)
        end

        it "should create a membership" do
          expect {
            household.add_member!(user)
          }.to change(Membership, :count).by(1)
        end

        context "when the user is already a member of the household" do
          before do
            FactoryGirl.create(:membership, :household => household, :user => user)
          end

          it "should not create a new membership" do
            expect {
              household.add_member!(user)
            }.to raise_error
          end
        end
      end
    end

    describe "#admins" do
      context "with no admins" do
        it "should return an empty set" do
          household.admins.should be_empty
        end
      end
      context "with a head admin" do
        let!(:head_admin) { m = FactoryGirl.create(:household_head_admin, :household => household); m.user }
        it "should return the head admin" do
          household.admins.should == [head_admin]
        end

        context "with another normal admin" do
          let!(:other_admin) { m = FactoryGirl.create(:membership, :household => household, :is_admin => true); m.user }
          it "should return the admin and head admin" do
            household.admins.should =~ [head_admin, other_admin]
          end
        end
      end
    end

    describe "#create_todo" do
      context "with a persisted household" do
        context "with a valid creator" do
          let(:todo_creator) { FactoryGirl.create(:user) }
          let!(:membership) { FactoryGirl.create(:membership, :household => household, :user => todo_creator, :is_admin => true) }
          let(:title) { 'bloo blar' }
          let(:notes) { "foobar" }
          let(:tags) { 'tag1, tag2, tag3' }

          it "should return the new todo item" do
            todo = household.create_todo(title, todo_creator, :notes => notes)
            todo.should be_a Completable::Todo
          end

          it "should create a new Todo item" do
            expect {
              household.create_todo(title, todo_creator, :notes => notes)
            }.to change(Completable::Todo, :count).by(1)
          end

          it "should add the todo item to the household" do
            expect {
              household.create_todo(title, todo_creator, :notes => notes)
            }.to change(household.todos, :count).by(1)
          end

          it "should save the title on the todo item" do
            todo = household.create_todo(title, todo_creator, :notes => notes)
            todo.title.should == title
          end

          it "should save the notes on the todo item" do
            todo = household.create_todo(title, todo_creator, :notes => notes)
            todo.notes.should == notes
          end

          it "should store the creator of the todo item" do
            todo = household.create_todo(title, todo_creator, :notes => notes)
            todo.creator.should == todo_creator
          end

          it "should attach tags to the new todo item" do
            todo = household.create_todo(title, todo_creator, :notes => notes, :tags => tags)
            todo.tag_titles.map(&:title).should =~ %w(tag1 tag2 tag3)
          end

          context "when the creator of the todo is not an administrator" do
            before do
              membership.update_column(:is_admin, false)
            end

            it "should raise an error" do
              expect {
                household.create_todo(title, todo_creator, :notes => notes)
              }.to raise_error
            end
          end

          context "when the creator of the todo doesn't belong to the household" do
            let(:other_household) { FactoryGirl.create(:household) }
            before do
              todo_creator.household = other_household
            end

            it "should raise an error" do
              expect {
                household.create_todo(title, todo_creator, :notes => notes)
              }.to raise_error
            end
          end

          context "with a nil notes" do
            let(:notes) { nil }
            it "should not raise an error" do
              expect {
                household.create_todo(title, todo_creator, :notes => notes)
              }.not_to raise_error
            end
          end

          context "with a blank title" do
            let(:title) { '' }
            it "should raise an error" do
              expect {
                household.create_todo(title, todo_creator, :notes => notes)
              }.to raise_error
            end
          end
        end

        context "with a nil creator" do
          let(:notes) { 'foobar' }
          let(:todo_creator) { nil }

          it "should not raise an error" do
            expect {
              household.create_todo(notes, todo_creator)
            }.to raise_error
          end
        end
      end
    end

    describe "#has_member?" do
      context "with a household that has a member" do
        let(:membership) { FactoryGirl.create(:membership, :household => household)}

        context "with a member of the household" do
          let(:member) { membership.user }
          it "should return true" do
            household.has_member?(member).should be_true
          end
        end

        context "with some other user" do
          let(:non_member) { FactoryGirl.create(:user) }
          it "should return false" do
            household.has_member?(non_member).should be_false
          end
        end
      end
    end

    describe "#invite_admin" do
      context "with an existing user" do
        let(:existing_user) { 
          m = FactoryGirl.create(:membership, :household => household)
          m.user
        }

        context "when the user is already an admin" do
        end

      end

      context "with an email not in the system" do
        let(:new_user) { 'nobody@nonexistent.com' }
      end
    end

    describe "#make_admin" do
      context "with a new household" do
        it "should set the user as an admin of the household"
      end

      context "with an existing household" do
        context "when the household already has an admin" do
          it "should not se the user as an admin of the household"
        end
      end
    end

    describe "#remove_member" do
      context "with an existing member of the household" do
        it "should remove a membership"
      end
    end
  end
end
