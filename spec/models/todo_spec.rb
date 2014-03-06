require 'spec_helper'

describe Todo do
  context "instance methods" do
    describe "complete!" do
      context "with a todo which is persisted" do
        let(:todo) { FactoryGirl.create(:todo) }

        context "with a valid completor" do
          let(:completor) { FactoryGirl.create(:user, :households => [todo.household]) }
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
          let(:other_completor) { FactoryGirl.create(:user, :households => [completed_todo.household]) }

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
  end
end
