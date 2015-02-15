require 'spec_helper'

describe Completable::Todo do
  describe "relationships" do
    describe "tagging" do
      context "with a todo" do
        let(:todo) { FactoryGirl.create(:todo) }
        
        context "that has no tags" do
          it "should return an empty set when asking for tags" do
            todo.tags.should be_empty
          end

          it "should return an empty set when asking for tag_joins" do
            todo.tag_titles.should be_empty
          end
        end

        context "that has a tag" do
          let!(:tag) { FactoryGirl.create(:tag, :taggable => todo) }
          let!(:tag_title) { tag.tag_title }

          it "should return the tag when requesting tags" do
            todo.tags.should == [tag]
          end

          it "should return the tag_join when querying for tag joins" do
            todo.tag_titles.should == [tag_title]
          end
        end
      end
    end
  end
  describe "instance methods" do
    describe "#accept!" do
      context "with a todo which is persisted" do
        let(:todo) { FactoryGirl.create(:todo) }

        context "with a valid acceptor" do
          let!(:valid_acceptor) { 
            u = FactoryGirl.create(:user)
            m = FactoryGirl.create(:household_admin, :household => todo.household, :member_id => u.id)
            u
          }

          context "when the todo is not completed" do
            it "should raise an error" do
              expect {
                todo.accept! :accepted_by => valid_acceptor
              }.to raise_error
            end
          end

          context "when the todo is already accepted" do
            let(:acceptor) { 
              m = FactoryGirl.create(:household_head_admin, :household => todo.household)
              m.user
            }

            before do
              todo.update_column(:accepted_at, (Time.now - 1.week))
              todo.update_column(:acceptor_id, acceptor.id)
            end

            it "should raise an error" do
              expect {
                todo.accept! :accepted_by => valid_acceptor
              }.to raise_error
            end
          end

          context "when the todo has been completed but not accepted" do
            let(:completor) {
              m = FactoryGirl.create(:membership, :household => todo.household)
              m.user
            }

            before do
              todo.complete! :completed_by => completor
            end

            it "should not raise an error" do
              expect {
                todo.accept! :accepted_by => valid_acceptor
              }.not_to raise_error
            end

            it "should set accepted_at on the todo" do
              todo.accept! :accepted_by => valid_acceptor
              todo.accepted_at.should_not be_nil
            end

            it "should set the acceptor_id on the todo" do
              todo.accept! :accepted_by => valid_acceptor
              todo.reload.acceptor.should == valid_acceptor
            end
          end
        end

        context "with an invalid acceptor" do
          let(:invalid_acceptor) {
            u = FactoryGirl.create(:user)
            m = FactoryGirl.create(:membership, :household => todo.household, :member_id => u)
          }
        end

        context "without an acceptor" do
          it "should raise an argument error" do
            expect {
              todo.accept! nil
            }.to raise_error
          end
        end
      end
    end

    describe "#accepted?" do
      context "with a todo that is not completed nor accepted" do
        let(:todo) { FactoryGirl.create(:todo) }
        it "should return false" do
          todo.accepted?.should be_false
        end
      end

      context "with a todo that is only completed" do
        let(:completed_todo) { FactoryGirl.create(:completed_todo) }
        it "should return false" do
          completed_todo.accepted?.should be_false
        end
      end

      context "with a todo that is accepted" do
        let(:accepted_todo) { FactoryGirl.create(:accepted_todo) }
        it "should return true" do
          accepted_todo.accepted?.should be_true
        end
      end
    end

    describe "complete!" do
      context "with a todo which is persisted" do
        let(:todo) { FactoryGirl.create(:todo) }

        context "with a valid completor" do
          let(:completor) { FactoryGirl.create(:user, :household => todo.household) }
          it "should mark the completed_at time of the todo" do
            todo.completed_at.should be_blank
            todo.complete!(:completed_by => completor)
            todo.completed_at.should_not be_blank
          end

          it "should store the completor of the todo item" do
            todo.complete!(:completed_by => completor)
            todo.completor.should == completor
          end
        end

        context "when the todo is already completed" do
          let(:completed_todo) { FactoryGirl.create(:completed_todo) }
          let(:other_completor) { FactoryGirl.create(:user, :household => completed_todo.household) }

          it "should raise an invalid transition exception" do
            expect {
              completed_todo.complete!(:completed_by => other_completor)
            }.to raise_error(StateMachine::InvalidTransition)
          end
        end

        context "with a nil completor provided" do
          it "should raise an error" do
            expect {
              todo.complete!(nil)
            }.to raise_error
          end

          it "should not set completed_at" do
            expect {
              todo.complete!(nil)
            }.to raise_error
            todo.reload.completor.should be_nil
          end
        end
      end
    end

    describe "#uncomplete!" do
      context "with a completed todo item" do
        let(:completed_todo) { FactoryGirl.create(:completed_todo) }
        it "should unset the completed_at timestamp" do
          completed_todo.uncomplete!
          completed_todo.completed_at.should be_blank
        end

        it "should unset the completor" do
          completed_todo.uncomplete!
          completed_todo.completor.should be_blank
        end
      end

      context "with a non completed todo item" do
        let(:todo) { FactoryGirl.create(:todo) }
        it "should raise an invalid transition error" do
          before_timestamp = todo.completed_at
          before_completor = todo.completor
          expect {
            todo.uncomplete!
          }.to raise_error(StateMachine::InvalidTransition)
        end
      end
    end
  end
end
