require 'spec_helper'

describe User do
  describe "relationships" do
    describe "memberships" do
      it "should have many memberships" do
        u = User.new
        u.membership.should be_nil
        m = Membership.new
        u.membership = m
        u.membership.should == m
      end
    end

    describe "household" do
      it "should have one household through memberships" do
        u = FactoryGirl.create(:user)
        u.household.should be_nil
        h = Household.create(:name => 'blah')
        m = Membership.create(:user => u, :household => h)
        u.reload.household.should == h
      end
    end
  end

  describe "instance methods" do
    describe "#administrates?" do
      context "with a user and household" do
        let(:user) { FactoryGirl.create(:user) }
        let(:household) { FactoryGirl.create(:household) }

        context "with a membership between the user and household" do
          let(:membership) { FactoryGirl.create(:membership, :household => household, :user => user) }

          it "should return false" do
            user.administrates?(household).should be_falsey
          end
          context "when the user is an admin of the household" do
            before do
              membership.update_column(:is_admin, true)
            end

            it "should return true" do
              user.administrates?(household).should be_truthy
            end
          end
        end
      end
    end
  end
end
