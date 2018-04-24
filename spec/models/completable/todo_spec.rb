require 'rails_helper'

describe Completable::Todo do
  describe "validations" do
    describe "presence" do
      subject { FactoryGirl.build(:todo) }
      it { should validate_presence_of(:title) }
      it { should validate_presence_of(:creator_id) }
      it { should validate_presence_of(:household_id) }
    end

    describe "creator_is_member" do
      let(:todo) { FactoryGirl.build(:todo) }
      let(:household) { todo.household }

      context "when creator is a member of the household" do
        it "should be valid" do
          expect(todo.valid?).to eq true
        end
      end

      context "when creator is not a member of the household" do
        before do
          c = todo.creator
          c.membership.destroy
        end

        it "should not be valid" do
          expect(todo.valid?).to eq false
        end

        it "should set the correct error message" do
          todo.valid?
          expect(todo.errors.full_messages.join).to include('is not a member of the household')
        end
      end
    end
  end

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

  describe "permissions" do
    describe "accept" do
      context "with an active todo" do
        let(:todo) { FactoryGirl.build(:todo) }
        let(:acceptor) { m = FactoryGirl.create(:household_admin); m.user }
        it "should not be allowed" do
          a = Ability.new(acceptor)
          expect(a.can?(:accept, todo)).to eq false
        end
      end

      context "with a completed todo" do
        let(:completed_todo) { FactoryGirl.build(:completed_todo) }
        context "with a member of the household" do
          let(:acceptor) { m = FactoryGirl.create(:membership); m.user }

          it "should not be allowed" do
            a = Ability.new(acceptor)
            expect(a.can?(:accept, completed_todo)).to eq false
          end
        end

        context "with a household admin of the household" do
          let(:acceptor) { m = FactoryGirl.create(:household_admin, :household => completed_todo.household); m.user }
          it "should be allowed" do
            a = Ability.new(acceptor)
            expect(a.can?(:accept, completed_todo)).to eq true
          end
        end

        context "with the head admin of the household" do
          let(:acceptor) { m = FactoryGirl.create(:household_head_admin, :household => completed_todo.household); m.user}
          it "should be allowed" do
            a = Ability.new(acceptor)
            expect(a.can?(:accept, completed_todo)).to eq true
          end
        end

        context "with a household admin of another household" do
          let(:acceptor) { m = FactoryGirl.create(:household_admin); m.user }
          it "should be allowed" do
            a = Ability.new(acceptor)
            expect(a.can?(:accept, completed_todo)).to eq false
          end
        end
      end

      context "with an accepted todo" do
        let(:accepted_todo) { FactoryGirl.build(:accepted_todo) }
        let(:acceptor) { m = FactoryGirl.create(:household_admin, :household => accepted_todo.household); m.user }
        it "should not be allowed" do
          a = Ability.new(acceptor)
          expect(a.can?(:accept, accepted_todo)).to eq false
        end
      end
    end

    describe "complete" do
      context "with an active todo" do
        let(:todo) { FactoryGirl.create(:todo) }
        let(:completor_from_house) { u = FactoryGirl.build(:user); u.household = todo.household; u; }
        let(:completor_not_from_house) { u = FactoryGirl.build(:user) }

        context "when the user is a member of the household" do
          it "should be allowed" do
            a = Ability.new(completor_from_house)
            expect(a.can?(:complete, todo)).to eq true
          end
        end

        context "when the user is not a member of the household" do
          it "should not be allowed" do
            a = Ability.new(completor_not_from_house)
            expect(a.can?(:complete, todo)).to eq false
          end
        end
      end

      context "with a completed todo" do
        let(:todo) { FactoryGirl.create(:completed_todo) }
        let(:completor) { u = FactoryGirl.build(:user); u.household = todo.household; u; }

        it "should not be allowed" do
          a = Ability.new(completor)
          expect(a.can?(:complete, todo)).to eq false
        end
      end

      context "with an accepted todo" do
        let(:todo) { FactoryGirl.create(:accepted_todo) }
        let(:completor) { u = FactoryGirl.build(:user); u.household = todo.household; u; }

        it "should not be allowed" do
          a = Ability.new(completor)
          expect(a.can?(:complete, todo)).to eq false
        end
      end
    end

    describe "uncomplete" do
      context "with an active todo" do
        let(:todo) { FactoryGirl.build(:todo) }

        context "with a member of the household" do
          let(:uncompletor) { m = FactoryGirl.create(:membership, :household => todo.household); m.user }

          it "should not be allowed" do
            a = Ability.new(uncompletor)
            expect(a.can?(:uncomplete, todo)).to eq false
          end
        end

        context "with an admin of the household" do
          let(:uncompletor) { m = FactoryGirl.create(:household_admin, :household => todo.household); m.user }
          it "should not be allowed" do
            a = Ability.new(uncompletor)
            expect(a.can?(:uncomplete, todo)).to eq false
          end
        end
      end

      context "with a completed todo" do
        let(:completed_todo) { FactoryGirl.create(:completed_todo) }

        context "with a user who is not a member of the household" do
          let(:attempting_uncompletor) { FactoryGirl.build(:user) }

          it "should not be allowed" do
            a = Ability.new(attempting_uncompletor)
            expect(a.can?(:uncomplete, completed_todo)).to eq false
          end
        end

        context "with a user who is a member of the household" do
          let(:attempting_uncompletor) { m = FactoryGirl.create(:membership, :household => completed_todo.household); m.user }

          it "should not be allowed" do
            a = Ability.new(attempting_uncompletor)
            expect(a.can?(:uncomplete, completed_todo)).to eq false
          end
        end

        context "with the user who completed the todo" do
          let(:completor) { completed_todo.completor }
          let!(:membership) { FactoryGirl.create(:membership, :user => completor, :household => completed_todo.household) }

          it "should be allowed" do
            a = Ability.new(completor)
            expect(a.can?(:uncomplete, completed_todo)).to eq true
          end
        end

        context "with an admin of the household" do
          let(:attempting_uncompletor) { m = FactoryGirl.create(:household_admin, :household => completed_todo.household); m.user }

          it "should be allowed" do
            a = Ability.new(attempting_uncompletor)
            expect(a.can?(:uncomplete, completed_todo)).to eq true
          end
        end
      end

      context "with an accepted todo" do
        let(:accepted_todo) { FactoryGirl.create(:accepted_todo) }

        context "with a member of the household" do
          let(:household_member) { m = FactoryGirl.create(:membership, :household => accepted_todo.household); m.user }

          it "should not be allowed" do
            a = Ability.new(household_member)
            expect(a.can?(:uncomplete, accepted_todo)).to eq false
          end
        end

        context "with an admin of the household" do
          let(:household_member) { m = FactoryGirl.create(:household_admin, :household => accepted_todo.household); m.user }

          it "should not be allowed" do
            a = Ability.new(household_member)
            expect(a.can?(:uncomplete, accepted_todo)).to eq false
          end
        end
      end
    end

    describe "destroy" do
      let(:household) { FactoryGirl.create(:household) }
      let(:active_todo) { FactoryGirl.build(:todo, :household => household) }
      let(:completed_todo) { FactoryGirl.build(:completed_todo, :household => household) }
      let(:accepted_todo) { FactoryGirl.build(:accepted_todo, :household => household) }

      context "with a non member of the household" do
        let(:non_member) { FactoryGirl.create(:user) }
        let(:ability) { Ability.new(non_member) }

        context "with an active todo" do
          it "should not be allowed" do
            expect(ability.can?(:destroy, active_todo)).to eq false
          end
        end

        context "with a completed todo" do
          it "should not be allowed" do
            expect(ability.can?(:destroy, completed_todo)).to eq false
          end
        end

        context "with an accepted todo" do
          it "should not be allowed" do
            expect(ability.can?(:destroy, accepted_todo)).to eq false
          end
        end
      end

      context "with a member of the household" do
        let(:household_member) { m = FactoryGirl.create(:membership, :household => household); m.user }
        let(:ability) { Ability.new(household_member) }

        context "with an active todo" do
          it "should not be allowed" do
            expect(ability.can?(:destroy, active_todo)).to eq false
          end
        end

        context "with a completed todo" do
          it "should not be allowed" do
            expect(ability.can?(:destroy, completed_todo)).to eq false
          end
        end

        context "with an accepted todo" do
          it "should not be allowed" do
            expect(ability.can?(:destroy, accepted_todo)).to eq false
          end
        end
      end

      context "with a household admin" do
        let(:household_admin) { m = FactoryGirl.create(:household_admin, :household => household); m.user }
        let(:ability) { Ability.new(household_admin) }

        context "with an active todo" do
          it "should be allowed" do
            expect(ability.can?(:destroy, active_todo)).to eq true
          end
        end

        context "with a completed todo" do
          it "should be allowed" do
            expect(ability.can?(:destroy, completed_todo)).to eq true
          end
        end

        context "with an accepted todo" do
          it "should be allowed" do
            expect(ability.can?(:destroy, accepted_todo)).to eq true
          end
        end
      end

      context "with the creator of the todo" do
        let(:todo_creator) { m = FactoryGirl.create(:membership, :household => household); m.user }
        let(:ability) { Ability.new(todo_creator) }
        before do
          active_todo.creator_id = todo_creator.id
          completed_todo.creator_id = todo_creator.id
          accepted_todo.creator_id = todo_creator.id
        end

        context "with an active todo" do
          it "should be allowed" do
            expect(ability.can?(:destroy, active_todo)).to eq true
          end
        end

        context "with a completed todo" do
          it "should be allowed" do
            expect(ability.can?(:destroy, completed_todo)).to eq true
          end
        end

        context "with an accepted todo" do
          it "should not be allowed" do
            expect(ability.can?(:destroy, accepted_todo)).to eq false
          end
        end
      end

      context "with the household head admin" do
        let(:household_head_admin) { m = FactoryGirl.create(:household_head_admin, :household => household); m.user }
        let(:ability) { Ability.new(household_head_admin) }

        context "with an active todo" do
          it "should be allowed" do
            expect(ability.can?(:destroy, active_todo)).to eq true
          end
        end

        context "with a completed todo" do
          it "should be allowed" do
            expect(ability.can?(:destroy, completed_todo)).to eq true
          end
        end

        context "with an accepted todo" do
          it "should be allowed" do
            expect(ability.can?(:destroy, accepted_todo)).to eq true
          end
        end
      end
    end

    describe "edit" do
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
            FactoryGirl.create(:membership, :household => todo.household, :member_id => u)
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
          todo.accepted?.should be_falsey
        end
      end

      context "with a todo that is only completed" do
        let(:completed_todo) { FactoryGirl.create(:completed_todo) }
        it "should return false" do
          completed_todo.accepted?.should be_falsey
        end
      end

      context "with a todo that is accepted" do
        let(:accepted_todo) { FactoryGirl.create(:accepted_todo) }
        it "should return true" do
          accepted_todo.accepted?.should be_truthy
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
            }.to raise_error(AASM::InvalidTransition)
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

        it "creates an event" do
          expect {
            completed_todo.uncomplete!
          }.to change(Event::TodoUncompleted, :count).by(1)
        end

        context "with a valid uncompletor" do
          let(:uncompletor) { completed_todo.completor }

          it "sets the actor of the created event" do
            completed_todo.uncomplete! :uncompleted_by => uncompletor
            expect(Event::TodoUncompleted.order(:created_at).last.actor).to eq(uncompletor)
          end
        end
      end

      context "with a non completed todo item" do
        let(:todo) { FactoryGirl.create(:todo) }
        it "should raise an invalid transition error" do
          expect {
            todo.uncomplete!
          }.to raise_error(AASM::InvalidTransition)
        end
      end
    end

    #TODO: Fill these in
    describe "#remove_tag" do
      context "with a todo" do
        context "that has no tags" do
          it "does not remove any Tags"
          it "does not remove any TagTitles"
        end

        context "that has a tag" do
          context "and we remove that tag" do
            it "removes a Tag"
            it "does not remove a TagTitle"
          end

          context "and we remove a different tag" do
            it "does not delete a Tag"
            it "does not delete a TagTitle"
          end
        end

        context "that has two tags" do
          context "and we remove one of them" do
            it "removes a Tag"
            it "leaves a single Tag attached to the Todo"
          end
        end
      end
    end

    describe "#reorder_near" do
      context "with a todo within a household" do
        let(:household) { FactoryGirl.create(:household) }
        let!(:todo) { FactoryGirl.create(:todo, :household => household) }
        context "with another todo" do
          let!(:second_todo) { FactoryGirl.create(:todo, :household => household) }

          context "reordering by itself" do
            context "above" do
              it "doesn't move" do
                expect {
                  todo.reorder_near(todo, false)
                }.not_to change(todo, :position)
              end
            end
            context "below" do
              it "doesn't move" do
                expect {
                  todo.reorder_near(todo)
                }.not_to change(todo, :position)
              end
            end
          end

          context "reordering below the second todo" do
            it "changes the todo's position" do
              expect {
                todo.reorder_near(second_todo)
              }.to change(todo, :position)
            end
          end
          context "reordering above the second todo" do
            it "doesn't change the todo's position" do
              expect {
                todo.reorder_near(second_todo, false)
              }.not_to change(todo, :position)
            end
          end
        end

        context "with 2 other todos" do
          let!(:second_todo) { FactoryGirl.create(:todo, :household => household) }
          let!(:third_todo) { FactoryGirl.create(:todo, :household => household) }

          context "reordering above the second" do
            it "doesn't change the todo's position" do
              expect {
                todo.reorder_near(second_todo, false)
              }.not_to change(todo, :position)
            end
          end

          context "reordering below the second" do
            it "changes the todo's position" do
              expect {
                todo.reorder_near(second_todo)
              }.to change(todo, :position)
            end
            it "moves the todo to position 2" do
              todo.reorder_near(second_todo)
              expect(todo.reload.position).to eq(2)
              expect(todo.higher_item).to eq(second_todo)
              expect(todo.lower_item).to eq(third_todo)
            end
            it "sets the second todo to be in position 1" do
              todo.reorder_near(second_todo)
              expect(second_todo.reload.position).to eq(1)
              expect(second_todo.lower_item).to eq(todo)
            end
          end

          context "reordering above the third" do
            it "changes the todo's position" do
              expect {
                todo.reorder_near(third_todo, false)
              }.to change(todo, :position)
            end
            it "moves the todo to position 2" do
              todo.reorder_near(third_todo, false)
              expect(todo.reload.position).to eq(2)
              expect(todo.higher_item).to eq(second_todo)
              expect(todo.lower_item).to eq(third_todo)
            end
            it "sets the second todo to be in position 1" do
              todo.reorder_near(third_todo, false)
              expect(second_todo.reload.position).to eq(1)
              expect(second_todo.lower_item).to eq(todo)
            end
          end

          context "reordering below the third" do
            it "moves the todo below the third" do
              todo.reorder_near(third_todo)
              expect(third_todo.reload.lower_item).to eq(todo.reload)
            end
            it "sets the todo as the last in the list" do
              todo.reorder_near(third_todo)
              expect(household.todos.last).to eq(todo.reload)
            end
          end
        end

        context "with many todos" do
          before do
            (1+rand(20)).times do |t|
              FactoryGirl.create(:todo, :household => household)
            end
            expect(household.todos.first).to eq(todo)
          end
          context "moving it to the top of the list" do
            before do
              todo.reorder_near(household.todos.first)
            end
            it "should be at the top of the list" do
              expect(household.todos.first).to eq(todo.reload)
            end
            it "should be at position 1" do
              expect(todo.reload.position).to eq(1)
            end
          end
          context "moving it after the first element" do
            it "should not move" do
              expect{
                todo.reorder_near(household.todos.first, false)
              }.not_to change(todo, :position)
            end
          end
          context "moving it before the second element" do
            it "should not move" do
              expect{
                todo.reorder_near(household.todos.first.lower_item, false)
              }.not_to change(todo, :position)
            end
          end
          context "moving it after the second element" do
            it "should move the todo" do
              expect{
                todo.reorder_near(household.todos.first.lower_item)
              }.to change(todo, :position)
            end
            it "should move to the second slot in the household list" do
              todo.reorder_near(household.todos.first.lower_item)
              expect(household.todos.to_a[1]).to eq(todo.reload)
            end
          end
          context "moving it to the bottom of the list" do
            before do
              todo.reorder_near(household.todos.last)
            end
            it "should be at the bottom of the list" do
              expect(household.todos.last).to eq(todo.reload)
            end
            it "should be at the last position" do
              expect(todo.reload.position).to eq(household.todos.size)
            end
          end
          context "moving upwards in the list" do
            let(:last_todo) { household.todos.last }
            let(:second_todo) { household.todos[1] }
            context "above the first todo" do
              it "takes it's place at the head of the list" do
                last_todo.reorder_near(todo, false)
                expect(last_todo.reload).to eq(household.todos.first)
              end
            end
            context "below the first todo" do
              it "becomes the second todo in the list" do
                last_todo.reorder_near(todo)
                expect(last_todo.reload.position).to eq(2)
                expect(last_todo).not_to eq(household.todos.first)
              end
            end
            context "above the second todo" do
              it "becomes the second todo in the list" do
                last_todo.reorder_near(second_todo, false)
                expect(last_todo.reload.position).to eq(2)
                expect(last_todo).not_to eq(household.todos.first)
              end
            end
            context "below the second todo" do
              it "becomes the third todo in the list" do
                last_todo.reorder_near(second_todo)
                expect(last_todo.reload.position).to eq(3)
                expect(last_todo).not_to eq(household.todos.first)
                expect(last_todo).not_to eq(household.todos[1])
              end
            end
          end
        end
      end
    end

    describe "#tag_with" do
      context "with a todo" do
        let(:todo) { FactoryGirl.create(:todo) }

        context "that has no tags" do
          let(:new_tag_string) { "foo" }
          it "should complete successfully" do
            expect {
              todo.tag_with(new_tag_string)
            }.not_to raise_error
          end

          it "should create a new TagTitle" do
            expect {
              todo.tag_with(new_tag_string)
            }.to change(TagTitle, :count).by(1)
          end

          it "should return a non empty list" do
            todo.tag_with(new_tag_string).should_not be_empty
          end

          it "should include the new tag in the list" do
            todo.tag_with(new_tag_string).map(&:title).should be_include new_tag_string
            todo.reload.tag_titles.map(&:title).should be_include new_tag_string
          end

          context "with an empty string" do
            it "should not create any TagTitles" do
              expect {
                todo.tag_with('')
              }.not_to change(TagTitle, :count)
            end

            it "should not create any tags" do
              expect {
                todo.tag_with('')
              }.not_to change(Tag, :count)
            end

            it "should return successfully" do
              expect {
                todo.tag_with('')
              }.not_to raise_error
            end
          end

          context "when adding multiple tags" do
            let(:multiple_new_tags) { "foo, bar,baz" }

            it "should create 3 new tags" do
              expect {
                todo.tag_with(multiple_new_tags)
              }.to change(TagTitle, :count).by(3)
            end

            it "should return a list of 3 tags" do
              todo.tag_with(multiple_new_tags).size.should == 3
            end

            it "should include each of the tags in the new tag title list" do
              todo.tag_with(multiple_new_tags)
              todo.reload.tag_titles.map(&:title).should include('foo')
              todo.tag_titles.map(&:title).should include('bar')
              todo.tag_titles.map(&:title).should include('baz')
            end
          end
        end

        context "with an existing tag" do
          let!(:existing_tag) { FactoryGirl.create(:tag, :taggable => todo) }
          let(:existing_tag_title) { existing_tag.tag_title }
          let(:existing_tag_name) { existing_tag_title.title }

          context "with an empty string" do
            it "should destroy a Tag" do
              expect {
                todo.tag_with('')
              }.to change(Tag, :count).by(-1)
            end

            it "should not remove any TagTitles" do
              expect {
                todo.tag_with('')
              }.not_to change(TagTitle, :count)
            end

            it "should return an empty array" do
              todo.tag_with('').should be_empty
            end
          end

          context "when adding a new tag" do
            let(:new_tag_string) { "bar" }

            it "should complete successfully" do
              expect {
                todo.tag_with(new_tag_string)
              }.not_to raise_error
            end

            it "should create a new TagTitle" do
              expect {
                todo.tag_with(new_tag_string)
              }.to change(TagTitle, :count).by(1)
            end

            it "should remove the existing tag" do
              todo.tag_with(new_tag_string)
              todo.reload.tag_titles.should_not be_include(existing_tag_title)
            end

            it "should return 1 tag titles" do
              todo.tag_with(new_tag_string).size.should == 1
            end

            it "should include the new tag in the list" do
              todo.tag_with(new_tag_string).map(&:title).should be_include new_tag_string
              todo.reload.tag_titles.map(&:title).should be_include new_tag_string
            end
          end

          context "when attempting to add the existing tag" do
            it "should complete successfully" do
              expect {
                todo.tag_with(existing_tag_name)
              }.not_to raise_error
            end

            it "should not create a new Tag" do
              expect {
                todo.tag_with(existing_tag_name)
              }.not_to change(Tag, :count)
            end

            it "should not create a new TagTitle" do
              expect {
                todo.tag_with(existing_tag_name)
              }.not_to change(TagTitle, :count)
            end

            context "within multiple tag inputs" do
              let(:new_tag_string) { " foo, bar; #{existing_tag_name}" }

              it "should create 2 Tags" do
                expect {
                  todo.tag_with(new_tag_string)
                }.to change(Tag, :count).by(2)
              end

              it "should create 2 TagTitles" do
                expect {
                  todo.tag_with(new_tag_string)
                }.to change(TagTitle, :count).by(2)
              end

              it "should attach the correct tags to the completable" do
                todo.tag_with(new_tag_string)
                todo.reload.tag_titles.map(&:title).should =~ ['foo', 'bar', existing_tag_name]
              end
            end
          end

          context "when adding tags not including the existing tag" do
            let(:new_tag_string) { "foo, bar; baz" }

            it "should return a list of 3 items" do
              todo.tag_with(new_tag_string).size.should == 3
            end

            it "should return a list of TagTitles containing all the input values" do
              todo.tag_with(new_tag_string).map(&:title).should =~ ['foo', 'bar', 'baz']
            end

            it "should create 3 Tags and remove 1" do
              expect {
                todo.tag_with(new_tag_string)
              }.to change(Tag, :count).by(2)
            end

            it "should create 3 TagTitles" do
              expect {
                todo.tag_with(new_tag_string)
              }.to change(TagTitle, :count).by(3)
            end
          end
        end
      end
    end
  end
end
