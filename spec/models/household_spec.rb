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

    describe "#has_member?" do
      context "with a household that has a member" do
        let(:membership) { FactoryGirl.create(:membership, :household => household)}

        context "with a member of the household" do
          let(:member) { membership.user }
          it "should return true" do
            household.has_member?(member).should be_truthy
          end
        end

        context "with some other user" do
          let(:non_member) { FactoryGirl.create(:user) }
          it "should return false" do
            household.has_member?(non_member).should be_falsey
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
