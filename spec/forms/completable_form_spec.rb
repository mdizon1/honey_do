require 'spec_helper'

describe CompletableForm do
  describe '.new' do
    context "with no arguments" do
      it "should not raise an error" do
        expect { CompletableForm.new() }.not_to raise_error
      end

      it "should return the form" do
        expect(CompletableForm.new().is_a? CompletableForm).to eq true
      end

      it "should store a new completable" do
        new_completable = CompletableForm.new().completable
        expect(new_completable.is_a? Completable).to eq true
        expect(new_completable.persisted?).to eq false
      end
    end

    context "with a completable" do
      let(:completable) { FactoryGirl.create(:todo) }
      
      it "should not raise an error" do
        expect { CompletableForm.new(completable) }.not_to raise_error
      end

      it "should return the form" do
        expect(CompletableForm.new(completable).is_a? CompletableForm).to eq true
      end

      it "should store the completable" do
        stored_completable = CompletableForm.new(completable).completable
        expect(stored_completable).to eq completable
        expect(stored_completable.persisted?).to eq true
      end
    end
  end

  describe '#submit' do
    context "with a household and valid user" do
      let(:household) { FactoryGirl.create(:household) }
      let(:user) { FactoryGirl.create(:user) }
      let!(:membership) { FactoryGirl.create(:membership, :household => household, :user => user) }
      let(:completable) { nil }
      let(:completable_form) { CompletableForm.new(completable) }
      
      context "creating" do
        context "with no params" do
          it "should raise an argument error" do
            expect {
              completable_form.submit
            }.to raise_error(ArgumentError)
          end
        end

        context "with valid params" do
          let(:completable_type) { Completable::Todo }
          let(:new_title) { Faker::Company.bs }
          let(:new_notes) { Faker::Hacker.phrases.sample }
          let(:params) {{
            :title => new_title,
            :notes => new_notes,
            :type => completable_type.to_s,
            :household => household,
            :creator => user
          }}

          it "should create a todo" do
            expect {
              completable_form.submit(params)
            }.to change(Completable, :count).by(1)
          end

          it "should create the todo with the correct attributes" do
            completable_form.submit(params)
            new_completable = completable_form.resource

            expect(new_completable.title).to eq new_title
            expect(new_completable.notes).to eq new_notes
            expect(new_completable.type).to eq completable_type.to_s
            expect(new_completable.household).to eq household
            expect(new_completable.creator).to eq user
          end

          it "should return true" do
            expect(
              completable_form.submit(params)
            ).to be true
          end

          it "should not add errors on the new completable" do
            completable_form.submit(params)
            new_completable = completable_form.resource
            expect(new_completable.errors.empty?).to be true
          end

          context "with tag attributes" do
            let(:params) {{
              :title => new_title,
              :notes => new_notes,
              :type => completable_type.to_s,
              :household => household,
              :creator => user,
              :tags => tag_params
            }}
            context "containing a single tag" do
              let(:tag_params) { ['Costco'] }

              context "when the tag_title doesn't exist" do
                it "should create the TagTitle" do
                  expect {
                    completable_form.submit(params)
                  }.to change(TagTitle, :count).by(1)
                end

                it "should create the Tag which joins the TagTitle to the new Completable" do
                  expect {
                    completable_form.submit(params)
                  }.to change(Tag, :count).by(1)
                end

                it "should associate the new tag with the completable" do
                  completable_form.submit(params)
                  new_tag = Tag.last
                  new_tag_title = TagTitle.last
                  expect(completable_form.completable.tags.include? new_tag).to eq true
                  expect(completable_form.completable.tag_titles.include? new_tag_title).to eq true
                end
              end

              context "when the tag title exists" do
                let!(:existing_tag_title) { FactoryGirl.create(:tag_title, :title => 'Costco') }

                it "should create the Tag" do
                  expect {
                    completable_form.submit(params)
                  }.to change(Tag, :count).by(1)
                end

                it "should not create a TagTitle" do
                  expect {
                    completable_form.submit(params)
                  }.not_to change(TagTitle, :count)
                end

                it "should associate the existing tag with the new completable" do
                  completable_form.submit(params)
                  expect(completable_form.completable.tag_titles.include? existing_tag_title).to eq true
                end
              end
            end

            context "containing two tags" do
              context "when one of the tag_titles exists" do
                let(:existing_title) { 'Costco' }
                let(:new_title) { 'Target' }
                let!(:existing_tag_title) { FactoryGirl.create(:tag_title, :title => existing_title) }
                let(:tag_params) { [existing_title, new_title] }

                it "should create two Tag objects" do
                  expect {
                    completable_form.submit(params)
                  }.to change(Tag, :count).by(2)
                end

                it "should create one TagTitle" do
                  expect {
                    completable_form.submit(params)
                  }.to change(TagTitle, :count).by(1)
                end

                it "should associate two tag titles with the new completable" do
                  completable_form.submit(params)
                  expect(completable_form.completable.tag_titles.map(&:title)).to match tag_params
                end
              end
            end
          end
        end

        context "with invalid params" do
          let(:completable_type) { Completable::Todo }
          let(:new_title) { Faker::Company.bs }
          let(:new_notes) { Faker::Hacker.phrases.sample }
          context "without a household" do
            let(:params) {{
              :title => new_title,
              :notes => new_notes,
              :type => completable_type.to_s,
              :creator => user
            }}

            it "should return false" do
              expect(completable_form.submit(params)).to be false
            end

            it "should add errors on the Completable" do
              completable_form.submit(params)
              expect(completable_form.resource.errors.empty?).to eq false
              expect(completable_form.errors.empty?).to eq false
              expect(completable_form.errors.messages[:household_id].present?).to eq true
            end
          end

          context "without a creator" do
            let(:params) {{
              :title => new_title,
              :notes => new_notes,
              :type => completable_type.to_s,
              :household => household
            }}

            it "should not create a Completable" do
              expect {
                completable_form.submit(params)
              }.not_to change(Completable, :count)
            end

            it "should return false" do
              expect(completable_form.submit(params)).to be false
            end

            it "should add errors on the completable" do
              completable_form.submit(params)
              expect(completable_form.resource.errors.empty?).to eq false
              expect(completable_form.errors.empty?).to eq false
              expect(completable_form.errors.messages[:creator_id].present?).to eq true
            end
          end
        end
      end

      context "updating" do
        context "with an existing completable" do
          let!(:completable) { FactoryGirl.create(:todo, :household => household, :creator => user) }
          let(:original_title) { completable.title }
          let(:original_notes) { completable.notes }

          context "when successful with valid params" do
            let(:new_title) { Faker::Company.bs }
            let(:new_notes) { Faker::Hacker.phrases.sample }
            let(:params) {{
              :title => new_title,
              :notes => new_notes,
            }}
            it "should not create a completable" do
              expect {
                completable_form.submit(params)
              }.not_to change(Completable, :count)
            end

            it "should change the attributes of the completable" do
              completable_form.submit(params)
              expect(completable_form.completable.title).to eq new_title
              expect(completable_form.completable.notes).to eq new_notes
            end

            context "when adding tags" do
              let(:tag_title_to_add) { 'Costco' }
              let(:tag_titles_to_add) { [] }
              let(:params) {{:tags => tag_titles_to_add }}
              context "when adding a single tag" do
                let(:tag_titles_to_add) { [tag_title_to_add] }

                context "that doesn't exist" do
                  it "should create a TagTitle" do
                    expect{
                      completable_form.submit(params)
                    }.to change(TagTitle, :count).by(1)
                  end

                  it "should create a Tag" do
                    expect{
                      completable_form.submit(params)
                    }.to change(Tag, :count).by(1)
                  end

                  it "should attach the TagTitle to the completable" do
                    completable_form.submit(params)
                    expect(completable_form.resource.tag_titles.map(&:title).include? tag_title_to_add).to be true
                  end

                  context "and the completable has another tag attached" do
                    let(:attached_tag_title_title) { 'Safeway' }
                    let(:attached_tag_title) { FactoryGirl.create(:tag_title, :title => attached_tag_title_title)}
                    let!(:attached_tag) { FactoryGirl.create(:tag, :tag_title => attached_tag_title, :taggable => completable) }

                    it "should create a TagTitle" do
                      expect{
                        completable_form.submit(params)
                      }.to change(TagTitle, :count).by(1)
                    end

                    it "attach a tag to the completable" do
                      previous_tags = completable_form.resource.tags.to_a
                      completable_form.submit(params)
                      new_tags = completable_form.resource.tags.to_a
                      expect(previous_tags).not_to match(new_tags)
                    end

                    it "should not change the number of Tags (creates one deletes one)" do
                      expect{
                        completable_form.submit(params)
                      }.not_to change(Tag, :count)
                    end

                    it "should attach the new TagTitle to the completable" do
                      completable_form.submit(params)
                      expect(completable_form.resource.tag_titles.map(&:title).include? tag_title_to_add).to be true
                    end

                    it "should leave a single Tag attached to the completable" do
                      completable_form.submit(params)
                      expect(completable_form.resource.tags.count).to eq 1
                      expect(completable_form.resource.tag_titles.map(&:title)).to eq tag_titles_to_add
                    end
                  end
                end


                context "that already exists" do
                  let!(:existing_tag_title) { FactoryGirl.create(:tag_title, :title => tag_title_to_add) }

                  it "should not create a TagTitle" do
                    expect{
                      completable_form.submit(params)
                    }.not_to change(TagTitle, :count)
                  end

                  it "should create a Tag" do
                    expect{
                      completable_form.submit(params)
                    }.to change(Tag, :count).by(1)
                  end

                  it "should attach a tag to the completable" do
                    expect{
                      completable_form.submit(params)
                    }.to change(completable_form.resource.tags, :count).by(1)
                  end

                  it "should attach the TagTitle to the completable (through the Tag)" do
                    completable_form.submit(params)
                    expect(completable_form.resource.tag_titles.map(&:title)).to eq tag_titles_to_add
                  end
                  
                  context "and is already attached to the completable" do
                    let!(:existing_tag) { FactoryGirl.create(:tag, :tag_title => existing_tag_title, :taggable => completable) }

                    it "should not create a TagTitle" do
                      expect{
                        completable_form.submit(params)
                      }.not_to change(TagTitle, :count)
                    end

                    it "should not create a Tag" do
                      expect{
                        completable_form.submit(params)
                      }.not_to change(completable_form.resource.tags, :count)
                    end

                    it "should leave the TagTitle attached to the completable" do
                      completable_form.submit(params)
                      expect(completable_form.resource.tag_titles.map(&:title)).to eq tag_titles_to_add
                    end
                  end
                end
              end

              context "when adding multiple tags" do
                let(:other_tag_title_to_add) { 'Food Max' }
                let(:tag_titles_to_add) { [tag_title_to_add, other_tag_title_to_add] }

                it "creates two TagTitles" do
                  expect{
                    completable_form.submit(params)
                  }.to change(TagTitle, :count).by(2)
                end

                it "creates two Tags" do
                  expect{
                    completable_form.submit(params)
                  }.to change(Tag, :count).by(2)
                end

                it "attaches two Tags to the completable" do
                  expect{
                    completable_form.submit(params)
                  }.to change(completable_form.resource.tags, :count).by(2)
                end

                it "attaches both TagTitles to the completable" do
                  completable_form.submit(params)
                  expect(completable_form.resource.tag_titles.map(&:title)).to match tag_titles_to_add
                end

                context "where one is new" do
                  let!(:existing_tag_title) { FactoryGirl.create(:tag_title, :title => tag_title_to_add) }

                  it "creates a single TagTitle" do
                    expect{
                      completable_form.submit(params)
                    }.to change(TagTitle, :count).by(1)
                  end

                  it "creates two Tags" do
                    expect{
                      completable_form.submit(params)
                    }.to change(Tag, :count).by(2)
                  end
                  
                  it "attaches two Tags to the completable" do
                    expect{
                      completable_form.submit(params)
                    }.to change(completable_form.resource.tags, :count).by(2)
                  end

                  it "attaches both TagTitles to the completable" do
                    completable_form.submit(params)
                    expect(completable_form.resource.tag_titles.map(&:title)).to match tag_titles_to_add
                  end

                  context "when the existing tag is already attached to the completable" do
                    let!(:existing_tag) { FactoryGirl.create(:tag, :tag_title => existing_tag_title, :taggable => completable) }

                    it "creates a single TagTitle" do
                      expect{
                        completable_form.submit(params)
                      }.to change(TagTitle, :count).by(1)
                    end

                    it "creates a single Tag" do
                      expect{
                        completable_form.submit(params)
                      }.to change(Tag, :count).by(1)
                    end

                    it "attaches a single Tag to the completable" do
                      expect{
                        completable_form.submit(params)
                      }.to change(completable_form.resource.tags, :count).by(1)
                    end

                    it "attaches both TagTitles to the completable" do
                      completable_form.submit(params)
                      expect(completable_form.resource.tag_titles.map(&:title)).to match tag_titles_to_add
                    end
                  end
                end

                context "that all exist already" do
                  let!(:existing_tag_title) { FactoryGirl.create(:tag_title, :title => tag_title_to_add) }
                  let!(:other_existing_tag_title) { FactoryGirl.create(:tag_title, :title => other_tag_title_to_add) }

                  it "doesn't create any TagTitles" do
                    expect{
                      completable_form.submit(params)
                    }.not_to change(TagTitle, :count)
                  end

                  it "creates two Tags" do
                    expect{
                      completable_form.submit(params)
                    }.to change(Tag, :count).by(2)
                  end

                  it "attaches two Tags to the completable" do
                    expect{
                      completable_form.submit(params)
                    }.to change(completable_form.resource.tags, :count).by(2)
                  end

                  it "attaches both TagTitles to the completable" do
                    completable_form.submit(params)
                    expect(completable_form.resource.tag_titles.map(&:title)).to match tag_titles_to_add
                  end

                  context "when a different TagTitle is attached to the completable" do
                    let(:already_attached_tag_title_title) { 'Sprouts' }
                    let(:already_attached_tag_title) { FactoryGirl.create(:tag_title, :title => already_attached_tag_title_title) }
                    let!(:already_attached_tag) { FactoryGirl.create(:tag, :tag_title => already_attached_tag_title, :taggable => completable) }

                    it "doesn't create any TagTitles" do
                      expect{
                        completable_form.submit(params)
                      }.not_to change(TagTitle, :count)
                    end

                    it "creates one Tags" do # the old tag is destroyed and two new ones are made, so the net change is 1
                      expect{
                        completable_form.submit(params)
                      }.to change(Tag, :count).by(1)
                    end

                    it "attaches both TagTitles to the completable" do
                      completable_form.submit(params)
                      expect(completable_form.resource.tag_titles.map(&:title)).to match tag_titles_to_add
                    end
                  end

                  context "when all the new TagTitles are already attached to the completable" do
                    let!(:existing_tag) { FactoryGirl.create(:tag, :tag_title => existing_tag_title, :taggable => completable) }
                    let!(:other_existing_tag) { FactoryGirl.create(:tag, :tag_title => other_existing_tag_title, :taggable => completable) }

                    it "doesn't create any TagTitles" do
                      expect{
                        completable_form.submit(params)
                      }.not_to change(TagTitle, :count)
                    end

                    it "doesn't create any Tags" do
                      expect{
                        completable_form.submit(params)
                      }.not_to change(Tag, :count)
                    end

                    it "doesn't attach any tags to the completable" do # they should already all be attached
                      expect{
                        completable_form.submit(params)
                      }.not_to change(completable_form.resource.tags, :count)
                    end

                    it "leaves both TagTitles attached to the completable" do
                      completable_form.submit(params)
                      expect(completable_form.resource.tag_titles.map(&:title)).to match tag_titles_to_add
                    end
                  end
                end
              end
            end
          end

          context "when failed with invalid params" do
            let(:new_notes) { Faker::Hacker.phrases.sample }
            let(:params) {{
              :title => nil,
              :notes => new_notes,
            }}
            it "should not create a completable" do
              expect {
                completable_form.submit(params)
              }.not_to change(Completable, :count)
            end

            it "should add errors on the completable" do
              completable_form.submit(params)
              expect(completable_form.completable.errors.messages.empty?).to eq false
            end

            it "should add errors on the form" do
              completable_form.submit(params)
              expect(completable_form.errors.messages.empty?).to eq false
            end
          end
        end
      end
    end
  end
end
