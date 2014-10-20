require 'spec_helper'

describe Membership do
  describe "relationships" do
    it { should belong_to(:household) }
    it { should belong_to(:user) }
  end

  describe "validations" do
    context "is_head_admin" do
      it "should only allow one head admin per household" do
        household = FactoryGirl.create(:household)
        admin1 = FactoryGirl.create(:user)
        wannabe_admin = FactoryGirl.create(:user)
        valid_membership = FactoryGirl.create(:membership, :household => household, :user => admin1, :is_head_admin => true)
        invalid_membership = FactoryGirl.build(:membership, :household => household, :user => wannabe_admin, :is_head_admin => true)
        invalid_membership.should_not be_valid
      end

      it "should allow multiple non-admins to be members of a household" do
        h = FactoryGirl.create(:household)
        m1 = FactoryGirl.create(:membership, :household => h)
        m2 = FactoryGirl.build(:membership, :household => h)
        m2.should be_valid
      end
    end
  end
end
