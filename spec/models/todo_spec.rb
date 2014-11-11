require 'spec_helper'

describe Todo do
  context "instance methods" do
    describe "accept!" do
      context "with a todo which is persisted" do
        let(:todo) { FactoryGirl.create(:todo) }

        context "with a valid acceptor" do
          let!(:valid_acceptor) { 
            u = FactoryGirl.create(:user)
            m = FactoryGirl.create(:household_admin, :household => todo.household, :member_id => u.id)
            #require 'debugger'
            #debugger
            u
          }

          context "when the todo is not completed" do
            it "should raise an error" do
              expect {
                todo.accept! valid_acceptor
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
                todo.accept! valid_acceptor
              }.to raise_error
            end
          end

          context "when the todo has been completed but not accepted" do
            let(:completor) {
              m = FactoryGirl.create(:membership, :household => todo.household)
              m.user
            }

            before do
              todo.complete! completor
            end

            it "should not raise an error" do
              #require 'debugger'
              #debugger
              expect {
                todo.accept! valid_acceptor
              }.not_to raise_error
            end

            it "should set accepted_at on the todo" do
              todo.accept! valid_acceptor
              todo.accepted_at.should_not be_nil
            end

            it "should set the acceptor_id on the todo" do
              todo.accept! valid_acceptor
              todo.acceptor.should == valid_acceptor
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

    describe "accepted?" do
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
            todo.complete!(completor)
            todo.completed_at.should_not be_blank
          end

          it "should store the completor of the todo item" do
            todo.complete!(completor)
            todo.completor.should == completor
          end
        end

        context "when the todo is already completed" do
          let(:completed_todo) { FactoryGirl.create(:completed_todo) }
          let(:other_completor) { FactoryGirl.create(:user, :household => completed_todo.household) }

          it "should not change the completed_at date" do
            before_timestamp = completed_todo.completed_at
            completed_todo.complete!(other_completor)
            completed_todo.completed_at.should == before_timestamp
          end

          it "should not change the completor" do
            before_completor = completed_todo.completor
            completed_todo.complete!(other_completor)
            completed_todo.completor.should == before_completor
            completed_todo.completor.should_not == other_completor
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

    describe "#complete?" do
      context "with a completed todo item" do
        let(:completed_todo) { FactoryGirl.create(:completed_todo) }
        it "should return true" do
          completed_todo.complete?.should be_true
        end
      end

      context "with a non completed todo item" do
        let(:todo) { FactoryGirl.create(:todo) }
        it "should return false" do
          todo.complete?.should be_false
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
        it "should do nothing" do
          before_timestamp = todo.completed_at
          before_completor = todo.completor
          todo.uncomplete!
          todo.reload.completed_at.should == before_timestamp
          todo.completor.should == before_completor
        end
      end
    end
  end
end
