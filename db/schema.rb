# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160614210635) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "completables", id: :serial, force: :cascade do |t|
    t.integer "household_id"
    t.integer "completor_id"
    t.datetime "completed_at"
    t.integer "acceptor_id"
    t.datetime "accepted_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text "notes", default: ""
    t.integer "creator_id"
    t.string "title", default: ""
    t.string "type"
    t.string "aasm_state"
    t.integer "position"
  end

  create_table "events", id: :serial, force: :cascade do |t|
    t.string "ip_address"
    t.string "description"
    t.string "type"
    t.integer "target_id"
    t.string "target_type"
    t.integer "actor_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "households", id: :serial, force: :cascade do |t|
    t.string "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "memberships", id: :serial, force: :cascade do |t|
    t.integer "member_id"
    t.integer "household_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean "is_admin", default: false
    t.boolean "is_head_admin", default: false
    t.index ["member_id", "household_id"], name: "index_memberships_on_member_id_and_household_id", unique: true
  end

  create_table "tag_titles", id: :serial, force: :cascade do |t|
    t.string "title"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["title"], name: "tag_titles_title_idx", unique: true
  end

  create_table "tags", id: :serial, force: :cascade do |t|
    t.string "taggable_type"
    t.integer "taggable_id"
    t.integer "tag_title_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["taggable_id", "taggable_type", "tag_title_id"], name: "tags_join_idx", unique: true
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "first_name", default: ""
    t.string "last_name", default: ""
    t.string "authentication_token", default: ""
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end
