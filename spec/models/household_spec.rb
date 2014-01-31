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
end
