import bcrypt from 'bcryptjs';
import User from '../models/User';
import Invitation from '../models/Invitation';

class UserController {
    async index(req, res){
        try {
            const users = await User.find();
            return res.json(users);
            
        } catch (error) {
            return res.status(401).json({error: "Something it's wrong, try again!"});
        }
    }

    async show(req, res){
        try {
            const { id } = req.params;
            const user = await User.findOne({_id:id});
    
            return res.json(user);
        } catch (error) {
            return res.status(401).json({error: "User not found!"});
        }

    }

    async create(req, res){
        try {
            const { first_name, last_name, phone, email, password } = req.body;
            const contacts = []
            const blocked_contacts = []
            const profile_picture = '';
            const created = new Date();
            const updated = new Date();
    
            let user = await User.findOne({ email });
    
            if (user){
                return res.status(409).json({ error: 'User already exists' });
            }
    
            const passwordHash = await bcrypt.hash(password, 8);
    
            user = await User.create({
                first_name,
                last_name,
                phone,
                email,
                password: passwordHash,
                contacts,
                blocked_contacts,
                profile_picture,
                created,
                updated
            });
    
            delete user.password;
    
            return res.json(user);
            
        } catch (error) {
            return res.status(401).json({error: "Please, verify all the fields"});
        }

    }

    async sendInvite(req, res){
        try{
            const { ids } = req.params;

            let arrayIds = ids.split('+');
            const inviterId = arrayIds[0]
            const inviteeId = arrayIds[1]
            
            let invitation = await Invitation.findOne({ inviter: inviterId, invitee: inviteeId });

            if (invitation){
                return res.status(400).json({ error: 'Invitation already exists' });
            }
            const userInviter = await User.findOne({_id:inviterId});

            if(userInviter.contacts.includes(inviteeId)){
                return res.status(400).json({ error: 'You are already friend with that person' });
            }

            for (let i=0; i<userInviter.contacts.length;i++){
                if (String(userInviter.contacts[i]._id)===String(inviteeId)){
                    return res.status(400).json({ error: 'You are already friend with that person' });
                }
            }

            invitation = await Invitation.create({
                inviter: inviterId,
                invitee: inviteeId
            })

            return res.json(invitation);
            
        } catch (error) {
            return res.status(401).json({error: "Something it's wrong, try again!"});
        }

    }

    async seeInvites(req, res){
        try{
            const invitations = await Invitation.find();
            return res.json(invitations);

        } catch (error) {
            return res.status(401).json({error: "Something it's wrong, try again!"});
        }
    }

    async cancelInvite(req, res){
        try{
            const {id} = req.params;
            await Invitation.findByIdAndRemove(id);

            return res.status(200).json("Deleted!");
        } catch (error) {
            return res.status(401).json({error: "Something it's wrong, try again!"});
        }
    }

    async refuseInvite(req, res){
        try{
            const {id} = req.params;
            await Invitation.findByIdAndRemove(id);

            return res.status(200).json("Deleted!");
        } catch (error) {
            return res.status(401).json({error: "Something it's wrong, try again!"});
        }
    }

    async confirmInvite(req, res){
        try{
            const {id} = req.params;
            const invitation = await Invitation.findById({_id:id});
            const {inviter, invitee} = invitation;
            console.log("Here")

            let userInviter = await User.findById({_id:inviter});
            let userInvitee = await User.findById({_id:invitee});
            console.log(userInvitee);
            console.log(userInvitee._id);
            console.log("pic " + userInvitee.profile_picture);

            let inviterName = userInviter.first_name + " " + userInviter.last_name;
            let inviteeName = userInvitee.first_name + " " + userInvitee.last_name;

            userInviter.contacts.push({_id:invitee._id, name: (userInvitee.first_name + " " + userInvitee.last_name), profile_picture:invitee.profile_picture});
            userInvitee.contacts.push({_id:inviter._id, name: (userInviter.first_name + " " + userInviter.last_name), profile_picture:inviter.profile_picture});
            console.log("userInvitee.first_name");
            await userInvitee.save();
            await userInviter.save();
            await Invitation.findByIdAndRemove(id);
            console.log("TESTES");

            return res.status(200).json("You have a new friend!");
        } catch (error) {
            return res.status(401).json({error: "Something it's wrong, try again!"});
        }
    }

    async brokenFriendship(req, res){
        try{
            const { ids } = req.params;

            let arrayIds = ids.split('+');
            const userId = arrayIds[0]
            const contactId = arrayIds[1]

            const user = await User.findOne({_id:userId});
            const contact = await User.findOne({_id:contactId});
  
            let userIndex = user.contacts.indexOf(contactId);
            user.contacts.splice(userIndex, 1);
            
            let contactIndex = contact.contacts.indexOf(userId);
            contact.contacts.splice(contactIndex, 1);

            console.log(user);

            user.save();
            contact.save();

            return res.status(200).json("broken friendship!");
        } catch (error) {
            return res.status(401).json({error: "Something it's wrong, try again!"});
        }
    }

    async showAllFriends(req, res){
        try{
            const { id } = req.params;

            const user = await User.findById({_id:id});

            return res.status(200).json(user.contacts);
        } catch (error) {
            return res.status(401).json({error: "Something it's wrong, try again!"});
        }
    }

}

export default UserController;