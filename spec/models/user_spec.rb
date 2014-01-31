require 'spec_helper'

describe User do
  describe "relationships" do
    describe "memberships" do
      it "should have many memberships" do
        u = User.new
        u.memberships.should be_empty
        m = Membership.new
        u.memberships << m
        u.memberships.should include m
        u.memberships.should == [m]
      end
    end

    describe "households" do
      it "should have many households through memberships" do
        u = FactoryGirl.create(:user)
        u.households.should be_empty
        h = Household.create(:name => 'blah')
        m = Membership.create(:user => u, :household => h)
        u.reload.households.should include h
      end
    end
  end
end
